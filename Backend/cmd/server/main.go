// cmd/main.go
package main

import (
	"whatsapp-clone/pkg/database"
	"whatsapp-clone/pkg/handlers"
	"whatsapp-clone/pkg/websocket"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
    database.ConnectDB()

    router := gin.Default()
    router.Use(static.Serve("/", static.LocalFile("./frontend/build", true)))

    router.GET("/api/messages", handlers.GetMessages)
    router.POST("/api/messages", handlers.PostMessage)
    router.POST("/api/upload", handlers.UploadFile)

    go websocket.HubInstance.Run()
    router.GET("/ws", handlers.ServeWs)

    router.Run(":8080")
}
