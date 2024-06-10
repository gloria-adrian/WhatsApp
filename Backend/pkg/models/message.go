// pkg/models/message.go
package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Message struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Username string             `bson:"username" json:"username"`
	Text     string             `bson:"text" json:"text"`
	File     string             `bson:"file,omitempty" json:"file,omitempty"`
}
