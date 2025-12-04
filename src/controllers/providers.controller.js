const { getProvidersService, getProviderIdService } = require("../services/providers.services");

const getProviderController = async (req, res) => {
    try {
        /** Query Parameters
         *  - first_name: string (optional)
         *  - last_name: string (optional)
         */
        let firstName = req.query.first_name?.trim() || null;
        let lastName = req.query.last_name?.trim() || null;
        let specialty = req.query.specialty?.trim() || null;
        let languages = req.query.languages?.trim() || null;

        if (firstName && lastName && specialty && languages) {

            // validate characters
            if (
                (firstName && !/^[a-zA-Z\s]+$/.test(firstName)) ||
                (lastName && !/^[a-zA-Z\s]+$/.test(lastName)) ||
                (specialty && !/^[a-zA-Z\s]+$/.test(specialty)) ||
                (languages && !/^[a-zA-Z\s]+$/.test(languages))
            ) {
                return res.status(400).json({ message: "input contains invalid characters" });
            }

            // validate max length
            if ((firstName.length || lastName.length || specialty.length || languages.length) > 30) {
                return res.status(400).json({ message: "caracters too long" });
            }
        }

        const filters = {
            first_name: firstName,
            last_name: lastName,
            specialty: specialty,
            languages: languages
        };
        const { data, error } = await getProvidersService(filters);

        if (error) return res.status(400).json({ message: 'Error fetching providers', error: error.message });
        if (!data || data.length === 0) return res.status(404).json({ message: "No providers found" });
        return res.status(200).json({ message: 'success', data: data });

    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getProviderIdController = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: "ID must be a number" })

        const { data, error } = await getProviderIdService(id);

        if (error) return res.status(400).json({ message: "Error fetching provider", error: error.message })
        if (!data) return res.status(404).json({ message: "Provider not found" })

        return res.status(200).json({ message: 'success', data: data });

    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { getProviderController, getProviderIdController };
