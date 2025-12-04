const { getProvidersService, getProviderIdService } = require("../services/providers.services");

// validate character
const isAlphabetic = (value) => /^[a-zA-Z\s]+$/.test(value);

const getProviderController = async (req, res) => {
    try {
        const firstName = req.query.first_name?.trim() || null;
        const lastName = req.query.last_name?.trim() || null;
        const specialty = req.query.specialty?.trim() || null;
        const languages = req.query.languages?.trim() || null;

        // fileds validateing
        const fields = { firstName, lastName, specialty, languages };

        for (const [key, val] of Object.entries(fields)) {
            if (!val) continue;

            // valid character
            if (!isAlphabetic(val)) {
                return res.status(400).json({ message: `${key} contains invalid characters` });
            }

            // limt length character
            if (val.length > 30) {
                return res.status(400).json({ message: `${key} exceeds max length` });
            }
        }

        const filters = {
            first_name: firstName,
            last_name: lastName,
            specialty,
            languages
        };

        const { data, error } = await getProvidersService(filters);

        if (error) return res.status(400).json({ message: "Error fetching providers", error: error.message });
        if (!data || data.length === 0) return res.status(404).json({ message: "No providers found" });

        return res.status(200).json({ message: "success", data });

    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};



const getProviderIdController = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID must be a number" });
        }

        const { data, error } = await getProviderIdService(id);

        if (error) return res.status(400).json({ message: "Error fetching provider", error: error.message });
        if (!data) return res.status(404).json({ message: "Provider not found" });

        return res.status(200).json({ message: "success", data });

    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { getProviderController, getProviderIdController };
