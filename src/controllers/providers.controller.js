const { getProvidersService, getProviderIdService } = require("../services/providers.services");

const getProviderController = async (req, res) => {
    try {
        const { data, error } = await getProvidersService();

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
