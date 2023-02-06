package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

type Campaign_plan struct {
	Id            int    `json:"id"`
	Version_id    int    `json:"version_id"`
	Campaign_name string `json:"campaign_name"`
	Org_id        int    `json:"org_id"`
	Created_by    int    `json:"created_by"`
	Updated_by    int    `json:"updated_by"`
	Deleted       string `json:"deleted"`
	Creation_date string `json:"creation_date"`
	Last_update   string `json:"last_update"`
}

var db *sql.DB
var err error

func main() {
	db, err = sql.Open("mysql", "root:Admin@123@tcp(127.0.0.1:3306)/planner")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()
	router := mux.NewRouter()
	router.HandleFunc("/campaign", getCampaign_plan).Methods("GET")
	router.HandleFunc("/campaign/{id}", getCampaignPlanById).Methods("GET")
	router.HandleFunc("/campaign/{start}/{end}", getCampaignPlanByDate).Methods("GET")
	fmt.Println("Server running on port :8010")
	http.ListenAndServe(":8010", router)
}

// Access whole campaign_plan table
func getCampaign_plan(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	result, err := db.Query("SELECT * from campaign_plan")
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var cam_pl []Campaign_plan
	for result.Next() {
		var campaign_plan Campaign_plan
		err := result.Scan(&campaign_plan.Id, &campaign_plan.Version_id, &campaign_plan.Campaign_name, &campaign_plan.Org_id, &campaign_plan.Created_by, &campaign_plan.Updated_by, &campaign_plan.Deleted, &campaign_plan.Creation_date, &campaign_plan.Last_update)
		if err != nil {
			panic(err.Error())
		}
		cam_pl = append(cam_pl, campaign_plan)
	}
	json.NewEncoder(w).Encode(cam_pl)
}

//Access  plan by id
func getCampaignPlanById(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	result, err := db.Query("SELECT * FROM campaign_plan WHERE id = ?", params["id"])
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var campaign_plan Campaign_plan
	for result.Next() {
		err := result.Scan(&campaign_plan.Id, &campaign_plan.Version_id, &campaign_plan.Campaign_name, &campaign_plan.Org_id, &campaign_plan.Created_by, &campaign_plan.Updated_by, &campaign_plan.Deleted, &campaign_plan.Creation_date, &campaign_plan.Last_update)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(campaign_plan)
}

// Access plan by creation_date
func getCampaignPlanByDate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	result, err := db.Query("SELECT * FROM campaign_plan WHERE creation_date BETWEEN  ? AND ?", params["start"], params["end"]+" 23:59:59")
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var cam_pl []Campaign_plan
	var campaign_plan Campaign_plan
	for result.Next() {
		err := result.Scan(&campaign_plan.Id, &campaign_plan.Version_id, &campaign_plan.Campaign_name, &campaign_plan.Org_id, &campaign_plan.Created_by, &campaign_plan.Updated_by, &campaign_plan.Deleted, &campaign_plan.Creation_date, &campaign_plan.Last_update)
		if err != nil {
			panic(err.Error())
		}
		cam_pl = append(cam_pl, campaign_plan)
	}
	//json.NewEncoder(w).Encode(campaign_plan)
	json.NewEncoder(w).Encode(cam_pl)
}

//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
