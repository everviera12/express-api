const { supabaseConnection } = require("../connection/supabase");

const getProvidersService = async (filters = {}, pagination = {}) => {
    let query = supabaseConnection.from("providers").select("*", { count: "exact" });;

    if (filters.first_name) {
        query = query.ilike("first_name", `%${filters.first_name}%`);
    }

    if (filters.last_name) {
        query = query.ilike("last_name", `%${filters.last_name}%`);
    }

    if (filters.specialty) {
        query = query.ilike("specialty", `%${filters.specialty}%`);
    }

    if (filters.languages) {
        query = query.contains("languages", [filters.languages]);
    }

    if (pagination.from !== undefined && pagination.to !== undefined) {
        query = query.range(pagination.from, pagination.to);
    }

    const { data, error, count } = await query;

    console.log(data);
    console.log(error);
    console.log(count);
    
    return { data, error, count };

    /* return await query; */
};

const getProviderIdService = async (id_provider) => {
    return await supabaseConnection.from("providers").select("*").eq("id", id_provider).maybeSingle();
}

module.exports = { getProvidersService, getProviderIdService };



