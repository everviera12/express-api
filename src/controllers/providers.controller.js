const { getProvidersService, getProviderIdService } = require("../services/providers.services");

const getProviderController = async (req, res) => {
    try {
        const { page = 1, limit = 10, ...filters } = req.query;

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const buildLink = (pageNum) => {
            const params = new URLSearchParams({ ...req.query, page: pageNum });
            return `${req.protocol}://${req.get("host")}${req.baseUrl}?${params.toString()}`;
        };

        const { data, count, error } = await getProvidersService(filters, { from, to });

        if (error) {
            return res.status(400).json({ message: "Error fetching providers" });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "No providers found", data: [] });
        }

        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({
            success: true,
            data,
            meta: {
                page,
                limit,
                total: count,
                totalPages,
                prevPage: page > 1 ? buildLink(page - 1) : null,
                nextPage: page < totalPages ? buildLink(page + 1) : null,
            },
        });

    } catch (err) {
        if (err.name === "ZodError") {
            return res.status(400).json({
                message: "Invalid query parameters",
                errors: err.errors,
            });
        }

        return res.status(500).json({ message: "Server error" });
    }
};


const getProviderIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await getProviderIdService(id);

        if (error) return res.status(400).json({ message: "Error fetching provider", error: error.message });
        if (!data) return res.status(404).json({ message: "Provider not found" });

        return res.status(200).json({ message: "success", data });

    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = { getProviderController, getProviderIdController };
