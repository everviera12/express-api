const { getProvidersService, getProviderIdService } = require("../services/providers.services");

// validate character
const isAlphabetic = (value) => /^[a-zA-Z\s]+$/.test(value);

const getProviderController = async (req, res) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        if (page < 1 || limit < 1) {
            return res.status(400).json({ message: "page and limit must be positive integers" });
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const firstName = req.query.first_name?.trim() || null;
        const lastName = req.query.last_name?.trim() || null;
        const specialty = req.query.specialty?.trim() || null;
        const languages = req.query.languages?.trim() || null;

        // validate fields
        const fields = { firstName, lastName, specialty, languages };

        for (const [key, val] of Object.entries(fields)) {
            if (!val) continue;

            if (!isAlphabetic(val)) {
                return res.status(400).json({ message: `${key} contains invalid characters` });
            }

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

        /* const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`; */
        const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

        console.log(req.protocol);
        console.log(req.get);
        console.log(req.path);

        console.log(baseUrl);

        const buildLink = (pageNum) => {
            const params = new URLSearchParams({
                ...req.query,
                page: pageNum,
                limit
            });

            return `${req.protocol}://${req.get("host")}${req.baseUrl}?${params.toString()}`;
        };

        const { data, count, error } = await getProvidersService(filters, { from, to });

        if (error) return res.status(400).json({ message: "Error fetching providers", error: error.message });
        if (!data || data.length === 0) return res.status(404).json({ message: "No providers found" });

        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({
            success: true,
            message: "success",
            meta: {
                page,
                totalPages,
                total: count,
                limit,
                data,
                prevPage: page > 1 ? buildLink(page - 1) : null,
                nextPage: page < totalPages ? buildLink(page + 1) : null,
            },

        });

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
