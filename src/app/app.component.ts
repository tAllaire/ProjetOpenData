import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Dataset } from '../js/datasets';
import * as L from 'leaflet';
import { markParentViewsForCheck } from '@angular/core/src/view/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  restItems: any;

  public datasets:Array<any> = [];
  public pollutionSets:Array<any> = [];
  public marker:Array<any> = [];
  public pollutionMarker:Array<any> = [];
  public datasetURL = Dataset;
  public infoZone:Array<any> = [];
  public bestLunchs:Array<any> = [];
  public displayTab:boolean = false;

  public compteur:number = 0;

  private evaluation:Array<string> = ["Allez-y sans soucis !",
  "Vous prenez deux trois risques",
  "A éviter dans l'idéal",
  "Dangereux"]

  private nantesMap;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    //this.getRestItems();
    // Déclaration de la carte avec les coordonnées du centre et le niveau de zoom.
    this.nantesMap = L.map('frugalmap').setView([47.218371, -1.553621], 13);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'Frugal Map'
    }).addTo(this.nantesMap);
  
    this.getAllData();
  }

  sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

  addMarker(info){
    const myIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png'
    });
    let popup = "<span>Station de mesure la plus proche : "+info.quartierpollution+"</span><br><span>Distance : "+info.distancequartier+
                "<br><span>Données du relevé :</span><table border='1'><thead><tr>"+
                "<th>Donnée étudiée</th>"+
                "<th>Type de prélèvement</th>"+
                "<th>Valeur de l'indice de pollution*</th>"+
                "<th>Limite/Objectif de la mesure</th>"+
                "<th>Valeur de la limite*</th>"+
                "</th></thead><tbody>"+
                "<tr><td>Azote</td>"+
                "<td>Moyenne à l'heure max</td>"+
                "<td>"+info.pollution.azote.heure+"</td>"+
                "<td>Limite sur 18h</td>"+
                "<td>"+info.pollution.azote.moyenne+"</td></tr>"+
                "<tr><td>Soufre</td>"+
                "<td>Moyenne à l'heure max</td>"+
                "<td>"+info.pollution.soufre.heure+"</td>"+
                "<td>Limite sur 24h</td>"+
                "<td>"+info.pollution.soufre.moyenne+"</td></tr>"+
                "<tr><td>Ozone</td>"+
                "<td>Moyenne à l'heure max</td>"+
                "<td>"+info.pollution.ozone.heure+"</td>"+
                "<td>Objectif sur 8h</td>"+
                "<td>"+info.pollution.ozone.moyenne+"</td></tr>"+
                "<tr><td>Particules</td>"+
                "<td>Moyenne jour max</td>"+
                "<td>"+info.pollution.particules.jour+"</td>"+
                "<td>limite sur 35j</td>"+
                "<td>"+info.pollution.particules.moyenne+"</td></tr></tbody></table><span>*des valeurs égales à 0 signifient que la station de mesure n'effectue pas ce relevé</span>"+
                "<br><h2>Evaluation finale : "+info.evaluation+"</h2>"
    let tooltip = "<h4>"+info.nom+"</h4><h5>"+info.categorie+"</h5><span>"+info.adresse+"</span>"
    L.marker(info.position, {icon: myIcon}).bindPopup(popup,{maxWidth:1000}).bindTooltip(tooltip).addTo(this.nantesMap);
  }

  addPollutionZone(info){
    const myIcon = L.icon({
      iconUrl: 'https://prospectareachamber.org/wp-content/uploads/2017/12/map-marker-icon-e1512334260964.png'
    });
    let tooltip = "<h4>Station de mesure : </h4><span>"+info.quartier+"</span>"
    L.marker(info.position, {icon: myIcon}).bindTooltip(tooltip).addTo(this.nantesMap);
  }

  getAllData(){
    this.getRestItems(this.pollutionSets,this.datasetURL.POL.AZOTE);
    this.getRestItems(this.pollutionSets,this.datasetURL.POL.OZONE);
    this.getRestItems(this.pollutionSets,this.datasetURL.POL.SOUFRE);
    this.getRestItems(this.pollutionSets,this.datasetURL.POL.PARTICULES);
    this.getRestItems(this.datasets,this.datasetURL.RES.LOIRE);
  }

  scan(){

    this.createMarkers()
    this.createPollutionZones()
    this.setPollutionInformation()

    //Affichage des résultats
    this.marker.forEach((element)=>{
      this.addMarker(element);
    })

    this.displayTab=true;
  }

  setPollutionInformation(){
    this.marker.forEach((marker)=>{
      let point={
        "quartier":"",
        "distance":10000,  //mètres au max d'un point
        "pollution":{
          "azote":{
            "heure":0,
            "moyenne":0
          },
          "soufre":{
            "heure":0,
            "moyenne":0
          },
          "particules":{
            "jour":0,
            "moyenne":0
          },
          "ozone":{
            "heure":0,
            "moyenne":0
          }
        }
      };

      this.pollutionMarker.forEach((pollution)=>{
        //compteur=0;
        if(point.distance>=this.nantesMap.distance(marker.position,pollution.position)){
          point.distance = this.nantesMap.distance(marker.position,pollution.position);
          point.quartier = pollution.quartier
        }
      });

      this.pollutionMarker.forEach((pollutionMarker)=>{
        if(pollutionMarker.quartier==point.quartier){
          if(pollutionMarker.set.includes("azote")){
            point.pollution.azote.moyenne = pollutionMarker.info.valeur_limite_moy_horaire_18h
            point.pollution.azote.heure = pollutionMarker.info.moy_horaire_max

          }
          if(pollutionMarker.set.includes("ozone")){
            point.pollution.ozone.moyenne = pollutionMarker.info.objectif_qualite_moy_8_horaire_max
            point.pollution.ozone.heure = pollutionMarker.info.moy_horaire_max
 
          }
          if(pollutionMarker.set.includes("particule")){
            point.pollution.particules.jour = pollutionMarker.info.moy_jour_max
            point.pollution.particules.moyenne = pollutionMarker.info.vl_limite_moy_journaliere_35j

          }
          if(pollutionMarker.set.includes("soufre")){
            point.pollution.soufre.heure = pollutionMarker.info.moy_horaire_max
            point.pollution.soufre.moyenne = pollutionMarker.info.valeur_limite_moy_horaire_24h

          }
        }
      })
      
      //Evalutation de la qualité de l'air d'une terrasse
      this.compteur = 0;
      if(point.pollution.azote.moyenne!=0 && point.pollution.azote.moyenne<=point.pollution.azote.heure){
        this.compteur++
      }
      if(point.pollution.soufre.moyenne!=0 && point.pollution.soufre.moyenne<=point.pollution.soufre.heure){
        this.compteur++
      }
      if(point.pollution.ozone.moyenne!=0 && point.pollution.ozone.moyenne<=point.pollution.ozone.heure){
        this.compteur++
      }
      if(point.pollution.particules.moyenne!=0 && point.pollution.particules.moyenne<=point.pollution.particules.jour){
        this.compteur++
      }
      switch(this.compteur){
        case 0:
          marker.evaluation = this.evaluation[0]
          break;
        case 1:
          marker.evaluation = this.evaluation[1]
          break;
        case 2:
          marker.evaluation = this.evaluation[2]
          break;
        default:
          marker.evaluation = this.evaluation[3]
          break;
      }

      if(this.compteur==0 || this.compteur==1){
        this.bestLunchs.push({
          "nom": marker.nom,
          "evaluation": marker.evaluation,
          "adresse": marker.adresse,
          "categorie": marker.categorie
        });
      }

      //Inscription des données pour le traitement
      marker.distancequartier = Math.round(point.distance)+"m";
      marker.quartierpollution = point.quartier;
      marker.pollution = point.pollution
    })
  }

  createPollutionZones(){
    //Récupération des positions
    this.pollutionSets.forEach((element) => {
      element.records.forEach((record) => {
        let informations = {
          "set":record.datasetid,
          "position":[
            record.geometry.coordinates[1],
            record.geometry.coordinates[0]
          ],
          "quartier":record.fields.nom_station,
          "info":record.fields
        }
        this.pollutionMarker.push(informations)
      })
    })
    //Affichage des résultats
    this.pollutionMarker.forEach((element)=>{
      this.addPollutionZone(element);
    })
  }

  createMarkers(){
    //Récupération des positions
    this.datasets.forEach((element) => {
      element.records.forEach((record) => {
        let category = "";
        let adresse = "";
        if(record.fields.categorie!==undefined) category = record.fields.categorie;
        if(record.fields.adresse2!==undefined) adresse = record.fields.adresse2;
        let informations = {
          "position":[
            record.geometry.coordinates[1],
            record.geometry.coordinates[0]
          ],
          "nom":record.fields.nomoffre,
          "adresse":adresse,
          "categorie":category,
          "quartierpollution":"",
          "distancequartier":"",
          "evalutation":"",
          "pollution":{
            "azote":{
              "heure":0,
              "moyenne":0
            },
            "soufre":{
              "heure":0,
              "moyenne":0
            },
            "particules":{
              "jour":0,
              "moyenne":0
            },
            "ozone":{
              "heure":0,
              "moyenne":0
            }
          }
        }
        this.marker.push(informations)
      })
    })
  }

  // Read all REST Items
  getRestItems(array,URL) {
    this.restItemsServiceGetRestItems(URL)
      .subscribe(
        restItems => {
          this.restItems = restItems;
          array.push({"records":this.restItems.records})
        }
      )
  }

  // Rest Items Service: Read all REST Items
  restItemsServiceGetRestItems(URL) {
    return this.http
      .get<any[]>(URL)
      .pipe(map(data => data));
  }
}
