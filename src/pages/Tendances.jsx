import { useState, useEffect } from "react";
import axios from "axios";
import "../css/Tendances.css";
import Navbar from "./Navbar";

export default function Tendances() {
	const API_BASE_URL =  (window._env_ && window._env_.API_BASE_URL)
  || process.env.REACT_APP_API_BASE_URL
  || 'http://10.10.2.134:8585' ;
    const userName = localStorage.getItem("name");
    const [trending, setTrending] = useState([]); 
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const hasWelcomed = localStorage.getItem("hasWelcomed");

        if (userName && !hasWelcomed) {
            alert(`Bienvenue ${userName} !`);
            localStorage.setItem("hasWelcomed", "true");
        }

        const fetchTrending = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setErrorMsg("Vous devez être connecté.");
                    return;
                }

                const res = await axios.get(`${API_BASE_URL}/series/trending`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Données reçues :", res.data);
                setTrending(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error(err);
                setErrorMsg("Impossible de charger les séries tendances.");
            }
        };

        fetchTrending();
    }, [userName]);



    return (
        <div className="tendances-page">
            <Navbar />

            <div className="tendances-content">
                <h1> Séries Tendances</h1>
                {userName && <p>Voici nos tendances, {userName} !</p>}

                {errorMsg && <p className="error-msg">{errorMsg}</p>}

                {trending.length === 0 ? (
                    <p>Aucune série tendance trouvée.</p>
                ) : (
                    <ul>
                        {trending.map((serie) => (
                            <li key={serie.id}>
                                <strong>{serie.title}</strong> <br />
                                {serie.views} vues <br />
                                Note moyenne : {serie.avgRating} <br />
                                Score : {serie.score}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
