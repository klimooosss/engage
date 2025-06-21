import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    token:null,
    loading: false,

    register: async (username, email, password) => {
        set({loading: true});
        try {
            const response = fetch("http://localhost:5000/api/auth/register", {
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

            if(!response.ok) throw new Error(data.message || "Something went wrong");

            await localStorage.setItem("user", JSON.stringify(data));
            await localStorage.setItem("token", data.token);

            set({token: data.token, user:data.user, loading: false})

            return {
                success: true
            };

        } catch (error) {
            set({loading:false});
            return {success:false, error: error.message}
        }
    }
}));