const { supabaseConnection } = require("../connection/supabase");

const getProvidersService = async () => {
    return await supabaseConnection
        .from("providers")
        .select("*");
};

const getProviderIdService = async (id_provider) => {
    return await supabaseConnection
        .from("providers")
        .select("*")
        .eq("id", id_provider)
        .single();
}

module.exports = { getProvidersService, getProviderIdService };