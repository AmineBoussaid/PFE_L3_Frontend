import axios from 'axios'; // Assurez-vous d'avoir installé axios

export const Agent1User_id : number = 1
export const Agent2User_id : number = 31
export const DepartementUser_id : number = 27
export const ServiceUser_id : number = 3
export const Technicien1User_id : number = 19
export const Technicien2User_id : number = 20
export const Technicien3User_id : number = 21
export const Technicien4User_id : number = 22
export const Technicien5User_id : number = 23

// URL de base de l'API
const API_BASE_URL = 'http://localhost:8080/api/users'; // Remplacez par l'URL réelle de votre API


// Fonction pour récupérer un utilisateur par ID
export async function getUser(userId: number) {

    try {
        const response = await axios.get(`${API_BASE_URL}/getById/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        throw error;
    }

}

