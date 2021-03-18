package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type Photo struct {
	ID     uint   `json:"id"`
	Name   string `gorm:"unique" json:"name"`
	Points string `json:"points"`
}

func compare(drawingData string, photoData int) {

}

func arrayify(stringData string) {
	var arr []int
	_ = json.Unmarshal([]byte(stringData), &arr)
	log.Printf("Unmarshaled: %v", arr)

}

func simplify(imageData []int) (ret []int) {
	for _, s := range imageData {
		if s != 0 {
			ret = append(ret, s)
		}
	}
	return

}

func (a *App) getPhoto(w http.ResponseWriter, r *http.Request) {
	var photo Photo
	vars := mux.Vars(r)
	println(vars)
	a.DB.First(&photo, "name = ?", vars["name"])
	arrayify(photo.Points)

}
