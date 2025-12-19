const { z } = require("zod");

/* =====================================================
    Schemas
===================================================== */
const providersQuerySchema = z.object({
    first_name: z.string().max(30).regex(/^[a-zA-Z\s]+$/).optional(),
    last_name: z.string().max(30).regex(/^[a-zA-Z\s]+$/).optional(),
    specialty: z.string().max(30).regex(/^[a-zA-Z\s]+$/).optional(),
    languages: z.string().max(30).optional(),

    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
}).strict();

const providerIdSchema = z.object({
    id: z.coerce.number().int().positive(),
});

/* =====================================================
    Generic Zod validator middleware
===================================================== */
const validate = (schema, property = "query") => {
    return (req, res, next) => {
        try {
            const parsed = schema.parse(req[property]);
            req[property] = parsed;
            next();
        } catch (err) {
            return res.status(400).json({
                message: "Validation error",
                errors: err.message
            });
        }
    };
};

module.exports = {
    validate,
    providersQuerySchema,
    providerIdSchema
};
