// controllers/CustomerController.js
const Customer = require('../models/customerModels.js');


// 1. Fetch all Customers (Read)
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 2. Add New Customer (Create)
exports.addCustomer = async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;

    // ലളിതമായ ഇൻപുട്ട് വാലിഡേഷൻ
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Please enter all required fields" });
    }

    const newCustomer = new Customer({
      name,
      email,
      phone,
      company
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: "Data validation failed", error: error.message });
  }
};

// 3. Update Customer Data (Update)
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updatedData, {
      new: true, // അപ്ഡേറ്റ് ചെയ്ത പുതിയ ഡാറ്റ തിരികെ ലഭിക്കാൻ
      runValidators: true // മോഡലിലെ വാലിഡേഷൻ നിയമങ്ങൾ പാലിക്കാൻ
    });

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: "Update failed", error: error.message });
  }
};

// 4. Delete Customer (Delete)
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed", error: error.message });
  }
};