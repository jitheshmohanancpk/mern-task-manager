// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middleware/auth'); // ടോക്കൺ പരിശോധിക്കാൻ

// എല്ലാ കസ്റ്റമർ റൂട്ടുകളും പ്രൊട്ടക്റ്റ് ചെയ്യാൻ 'auth' മിഡിൽവെയർ ഉപയോഗിക്കാം

// 1. എല്ലാ കസ്റ്റമർമാരെയും കാണാൻ (Read)
router.get('/', auth, customerController.getCustomers);

// 2. പുതിയ കസ്റ്റമറെ ചേർക്കാൻ (Create)
router.post('/add', auth, customerController.addCustomer);

// 3. കസ്റ്റമർ വിവരങ്ങൾ അപ്ഡേറ്റ് ചെയ്യാൻ (Update)
router.put('/update/:id', auth, customerController.updateCustomer);

// 4. കസ്റ്റമറെ ഒഴിവാക്കാൻ (Delete)
router.delete('/delete/:id', auth, customerController.deleteCustomer);

module.exports = router;