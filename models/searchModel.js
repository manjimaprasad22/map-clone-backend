const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    place: {
        type: Array,
        required: true
    },
  
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);


