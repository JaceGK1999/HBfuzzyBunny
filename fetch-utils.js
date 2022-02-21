// Create your own supabase database using the provided seeds.sql file
const SUPABASE_URL = 'https://uhmsxsfarryniihsuyry.supabase.co';
const SUPABASE_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVobXN4c2ZhcnJ5bmlpaHN1eXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ4NTg5OTUsImV4cCI6MTk2MDQzNDk5NX0.DX8Yp3q-uUt4Q185uQlz61drW20MespMboRangENHIg';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

export function getUser() {
    return client.auth.session() && client.auth.session().user;
}

export async function getFamilies() {
    const response = await client
        .from('loving_families')
        .select('*, fuzzy_bunnies (*)')
        .match({ 'fuzzy_bunnies.user_id': client.auth.session().user.id });
    // fetch all families and their bunnies

    return checkError(response);
}

export async function deleteBunny(id) {
    const response = await client.from('fuzzy_bunnies').delete().match({ id: id }).single();
    // delete a single bunny using the id argument

    return checkError(response);
}

export async function createBunny(bunny) {
    const response = await client.from('fuzzy_bunnies').insert({
        ...bunny,
        user_id: client.auth.session().user.id,
    });
    // create a bunny using the bunny argument

    return checkError(response);
}

// MARTHA STEWART (PRE-MADE) FUNCTIONS

export async function checkAuth() {
    const user = getUser();

    if (!user) location.replace('../');
}

export async function redirectIfLoggedIn() {
    if (getUser()) {
        location.replace('./families');
    }
}

export async function signupUser(email, password) {
    const response = await client.auth.signUp({ email, password });

    return response.user;
}

export async function signInUser(email, password) {
    const response = await client.auth.signIn({ email, password });

    return response.user;
}

export async function logout() {
    await client.auth.signOut();

    return (window.location.href = '../');
}

function checkError({ data, error }) {
    return error ? console.error(error) : data;
}
