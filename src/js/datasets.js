//Lien des différentes API
export const Dataset = {
    "POL": {
        "OZONE":{
                "nom":"Niveau de pollution d'ozone dans l'agglomération nantaise",
                "url":"https://data.nantesmetropole.fr/explore/dataset/323266205_niveau-pollution-ozone-agglomeration-nantaise/table/?disjunctive.nom_station&disjunctive.typo",
                "data":"https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=323266205_niveau-pollution-ozone-agglomeration-nantaise&facet=annee&facet=nom_station&facet=typo"
        },
        "SOUFRE":{
            "nom":"Niveau du dioxyde de soufre dans l'agglomération nantaise",
            "url":"https://data.nantesmetropole.fr/explore/dataset/323266205_niveau-dioxyde-soufre-agglomeration-nantaise/table/?disjunctive.nom_station&disjunctive.typo",
            "data":"https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=323266205_niveau-dioxyde-soufre-agglomeration-nantaise&facet=annee&facet=nom_station&facet=typo"
        },
        "AZOTE":{
            "nom":"Niveau de dioxyde d'azote dans l'agglomération nantaise",
            "url":"https://data.nantesmetropole.fr/explore/dataset/323266205_niveau-dioxyde-azote-agglomeration-nantaise/table/?disjunctive.nom_station&disjunctive.typo",
            "data":"https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=323266205_niveau-dioxyde-azote-agglomeration-nantaise&facet=annee&facet=nom_station&facet=typo"
        },
        "PARTICULES":{
            "nom":"Niveau de pollution en particules fines PM10 dans l'agglomération nantaise",
            "url":"https://data.nantesmetropole.fr/explore/dataset/323266205_niveau-pollution-particules-fines-pm10-agglomeration-nantaise/table/?disjunctive.nom_station&disjunctive.typo",
            "data":"https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=323266205_niveau-pollution-particules-fines-pm10-agglomeration-nantaise&facet=annee&facet=nom_station&facet=typo"
        },
    },
    "RES":{
        "LOIRE":{
            "nom":"Restaurants en Loire-Atlantique",
            "url":"https://data.nantesmetropole.fr/explore/dataset/793866443_restaurants-en-loire-atlantique/table/",
            "data":"https://data.nantesmetropole.fr/api/records/1.0/search/?dataset=793866443_restaurants-en-loire-atlantique&rows=190&facet=type&facet=categorie&facet=commune&refine.commune=NANTES&refine.type=Restaurant"
        },
    }
}