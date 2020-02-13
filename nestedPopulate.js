const assert = require('assert');
const mongoose = require('mongoose');
mongoose.set('debug', true);

const GITHUB_ISSUE = `gh7273`;
const connectionString = `mongodb://localhost:27017/${GITHUB_ISSUE}`;
const { Schema } = mongoose;

run()
  .then(() => console.log('done'))
  .catch(error => console.error(error.stack));

async function run() {
  await mongoose.connect(connectionString);
  await mongoose.connection.dropDatabase();

  const Item1 = mongoose.model('Item1', new Schema({ name: String }));
  const Item2 = mongoose.model('Item2', new Schema({ name: String }));

  const schema = new Schema({
    equips: [
      {
        item: { type: Schema.Types.ObjectId, ref: 'equips' }, // <-- ignore this
        assistents: [
          {
            item: {
              type: Schema.Types.ObjectId,
              refPath: 'equips.assistents.col'
            }, // <-- THIS is the populate that fails
            rol: String,
            col: String // <-- here we can find the model to populate with
          }
        ]
      }
    ]
  });

  const Model = mongoose.model('MyModel', schema);

  const item1 = await Item1.create({ name: 'item1' });
  const item2 = await Item2.create({ name: 'item2' });

  await Model.create({
    equips: [
      {
        assistents: [
          { item: item1._id, col: 'Item1' },
          { item: item2._id, col: 'Item2' }
        ]
      }
    ]
  });

  // Do this instead:
  let doc = await Model.findOne().populate('equips.assistents.item');

  console.log(doc.equips[0].assistents); // both `item1` and `item2` populated

  // Not this:
  doc = await Model.findOne();

  for (let i = 0; i < doc.equips.length; ++i) {
    for (let j = 0; j < doc.equips[i].assistents.length; ++j) {
      doc.populate('equips.' + i + '.assistents.' + j + '.item');
    }
  }

  doc = await doc.execPopulate();

  console.log(doc.equips[0].assistents); // `item2` not populated
}
