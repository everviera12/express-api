const { supabaseConnection } = require("../connection/supabase");

const getUserInfo = async (userId) => {
    const { data, error } = await supabaseConnection
        .from("role_users")
        .select(`
            user_id,
            role,
            first_name,
            last_name
        `)
        .eq("user_id", userId)
        .single();

    return { data, error };
};

const loginWithEmail = async (email, password) => {
    const { data, error } = await supabaseConnection.auth.signInWithPassword({
        email,
        password,
    });

    return { data, error };
};


const registerWithEmail = async (email, password) => {
    const { data, error } = await supabaseConnection.auth.signUp({
        email,
        password,
    });

    return { data, error };
}

module.exports = { loginWithEmail, registerWithEmail, getUserInfo };