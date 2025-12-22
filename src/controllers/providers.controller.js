const { getProvidersService, getProviderIdService } = require("../services/providers.service");

const getProviderController = async (req, res) => {
    try {
        const { page, limit, ...filters } = req.query;

        const pageNum = Number(req.query.page ?? 1);
        const limitNum = Number(req.query.limit ?? 10);

        const from = (pageNum - 1) * limitNum;
        const to = from + limitNum - 1;

        const buildLink = (targetPage) => {
            const params = new URLSearchParams({
                ...filters,
                page: targetPage,
                limit: limitNum,
            });

            return `${req.protocol}://${req.get("host")}${req.baseUrl}?${params.toString()}`;
        };

        const { data, count, error } = await getProvidersService(filters, { from, to });

        if (error) {
            return res.status(400).json({ message: "Error fetching providers", error: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "No providers found", data: [] });
        }

        const totalPages = Math.ceil(count / limitNum);

        return res.status(200).json({
            success: true,
            data: data ?? [],
            meta: {
                page: pageNum,
                limit: limitNum,
                total: count,
                totalPages,
                prevPage: pageNum > 1 ? buildLink(pageNum - 1) : null,
                nextPage: pageNum < totalPages ? buildLink(pageNum + 1) : null,
            },
        });

    } catch (err) {
        if (err.name === "ZodError") {
            return res.status(400).json({
                message: "Invalid query parameters",
                errors: err.errors,
            });
        }

        return res.status(500).json({ message: "Server error", error: err.message });
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
