const { supabaseConnection } = require("../connection/supabase");

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

module.exports = { loginWithEmail, registerWithEmail };