import { create } from "zustand";

const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    storeLoading: false,

    register: async (username, email, password) => {
        set({ storeLoading: true });
        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Something went wrong");

            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);

            set({ token: data.token, user: data.user, storeLoading: false });

            return {
                success: true
            };

        } catch (error) {
            set({ storeLoading: false });
            return { success: false, error: error.message }
        }
    },

    login: async (email, password) => {
        set({storeLoading: true});

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if(!response.ok) console.log(data.message);

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

            set({token: data.token, user: data.user, storeLoading: false });

            return {success: true};
        } catch (error) {
            set({storeLoading: false});
            return {success:false, error:error.message};
        }
    },


    checkAuth: async () => {
        try {
            const token = localStorage.getItem("token");
            const userJson = localStorage.getItem("user");

            const user = userJson ? JSON.parse(userJson) : null;

            set({token, user})

        } catch (error) {
            console.log("Auth Check Failed.")
        }
    },

    logout: async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({token: null, user: null})
    }
 }));

export { useAuthStore };