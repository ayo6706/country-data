import mongoose, { Schema } from 'mongoose';
import Country from './models';

const CountrySchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    alpha3Code: { type: String, require: true },
    capital: { type: String, required: true },
    population: { type: Number, required: true },
    area: { type: Number, required: true },
    region: { type: String, required: true },
    subregion: { type: String, required: true },
    languages: [{ type: String }],
    borders: [{ type: Schema.Types.ObjectId, ref: 'Country' }]
  });
  
  export default mongoose.model<Country>('Country', CountrySchema);