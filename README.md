# Amrita-MUN '25 Website

The Amrita MUN ’25 website was developed as the official registration and management portal for the event, scheduled from September 19 - 21, 2025, organised by the Amrita MUN Society (A-MUNSO).

The platform handled the end-to-end delegate onboarding workflow, including user registration, preference submission for committees, roles, and country allocations. It also provided application status tracking for users. On the admin side, the system included a dashboard for monitoring registration stats, reviewing applications, and managing approvals and allocations.

![image](https://github.com/user-attachments/assets/003f516e-6453-4395-bfb9-4084e14ab044)

## Getting Started

Follow the steps below to set up and run the project locally:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/SudharsanSaravanan/amrita-mun-web-2025.git
    cd amrita-mun-web-2025
    ```

2.  **Install Dependencies**


    ```bash
    npm install
    npm install react-tilt framer-motion --legacy-peer-deps
    ```

3.  **Set Up Environment Variables**

    Create a `.env` file in the root directory and add the following:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

3.  **Run the Development Server**


    ```bash
    npm run dev
    ```

    Once the development server is running, you can view the website at `http://localhost:3000`.

