const { supabaseConnection } = require("../connection/supabase");

const getProvidersService = async (filters = {}) => {
    let query = supabaseConnection.from("providers").select("*");

    if (filters.first_name) {
        query = query.ilike("first_name", `%${filters.first_name}%`);
    }

    return await query;
};

const getProviderIdService = async (id_provider) => {
    return await supabaseConnection
        .from("providers")
        .select("*")
        .eq("id", id_provider)
        .maybeSingle();
}

module.exports = { getProvidersService, getProviderIdService };



