package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

type Drawing struct {
	ID     uint   `json:"id"`
	Name   string `gorm:"unique" json:"name"`
	Points string `json:"points"`
}

type App struct {
	DB *gorm.DB
}

func (a *App) Initialize(dbDriver string, dbURI string) {
	db, err := gorm.Open(dbDriver, dbURI)
	if err != nil {
		panic("failed to connect database")
	}
	a.DB = db

	// Migrate the schema.
	a.DB.AutoMigrate(&Drawing{})
}

func (a *App) handler(w http.ResponseWriter, r *http.Request) {
	// Create a test Drawing.
	a.DB.Create(&Drawing{Name: "test"})

	// Read from DB.
	var drawing Drawing
	a.DB.First(&drawing, "name = ?", "test")

	// Write to HTTP response.
	w.WriteHeader(200)
	w.Write([]byte(drawing.Name))

	// Delete.
	a.DB.Delete(&drawing)
}

func (a *App) ListHandler(w http.ResponseWriter, r *http.Request) {
	var drawings []Drawing

	// Select all drawings and convert to JSON.
	a.DB.Find(&drawings)
	w.Write([]byte("drawings"))
	drawingsJSON, _ := json.Marshal(drawings)

	// Write to HTTP response.
	w.WriteHeader(200)
	w.Write([]byte(drawingsJSON))
}

func (a *App) ViewHandler(w http.ResponseWriter, r *http.Request) {
	var drawing Drawing
	vars := mux.Vars(r)

	// Select the drawing with the given name, and convert to JSON.
	println(vars)
	a.DB.First(&drawing, "name = ?", vars["name"])
	drawingJSON, _ := json.Marshal(drawing)

	// Write to HTTP response.
	w.WriteHeader(200)
	w.Write([]byte(drawingJSON))
}

func (a *App) CreateHandler(w http.ResponseWriter, r *http.Request) {
	// Parse the POST body to populate r.PostForm.
	if err := r.ParseForm(); err != nil {
		panic("failed in ParseForm() call")
	}

	// Create a new drawing from the request body.
	drawing := &Drawing{
		Name:   r.PostFormValue("name"),
		Points: r.PostFormValue("points"),
	}
	a.DB.Create(drawing)

	// Form the URL of the newly created drawing.
	u, err := url.Parse(fmt.Sprintf("/drawings/%s", drawing.Name))
	if err != nil {
		panic("failed to form new Drawing URL")
	}
	base, err := url.Parse(r.URL.String())
	if err != nil {
		panic("failed to parse request URL")
	}

	// Write to HTTP response.
	w.Header().Set("Location", base.ResolveReference(u).String())
	w.WriteHeader(201)
}

func (a *App) UpdateHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	// Parse the request body to populate r.PostForm.
	if err := r.ParseForm(); err != nil {
		panic("failed in ParseForm() call")
	}

	// Set new drawing values from the request body.
	drawing := &Drawing{
		Name:   r.PostFormValue("name"),
		Points: r.PostFormValue("points"),
	}

	// Update the drawing with the given name.
	a.DB.Model(&drawing).Where("name = ?", vars["name"]).Updates(&drawing)

	// Write to HTTP response.
	w.WriteHeader(204)
}

func (a *App) DeleteHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	// Delete the drawing with the given name.
	a.DB.Where("name = ?", vars["name"]).Delete(Drawing{})

	// Write to HTTP response.
	w.WriteHeader(204)
}

func main() {
	a := &App{}
	a.Initialize("sqlite3", "test.db")

	r := mux.NewRouter()
	r.HandleFunc("/drawings/{name:.+}", a.UpdateHandler).Methods("PUT")
	r.HandleFunc("/drawings/{name:.+}", a.DeleteHandler).Methods("DELETE")
	r.HandleFunc("/drawings", a.CreateHandler).Methods("POST")
	r.HandleFunc("/drawings", a.ListHandler).Methods("GET")
	r.HandleFunc("/drawings/{name:.+}", a.ViewHandler).Methods("GET")
	r.HandleFunc("/", a.handler)

	http.Handle("/", r)
	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}

	defer a.DB.Close()
}

//   insert into drawings values (1, "My Drawing", "[1,2,5,6,7,8,9,10]");
