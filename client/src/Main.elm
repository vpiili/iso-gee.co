module Main exposing (..)

import Browser
import Html exposing (Html, text, div, h1, img, select)
import Html.Attributes exposing (src)
import Http
import Json.Decode exposing (Decoder, field, string)


---- MODEL ----

type alias GambinaData =
  { id : String
  , city : String
  , alko : String
  , quantity : String
  }

type Data
  = Failure
  | Loading
  | Success String

type alias Model =
  { city : String
  , data : Data 
  }

url : String
url = "http://localhost:8080/api/gambinaData"

init : ( Model, Cmd Msg )
init =
  ( { city = "Turku", data = Loading }
  , Http.get
    { url = url
    , expect = Http.expectString GotData
    } 
  )



---- UPDATE ----


type Msg
  = Change String | GotData (Result Http.Error String)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    Change city ->
      ( { model | city = city }, Cmd.none )

    GotData result ->
      case result of
        Ok data ->
          ( { model | data = Success data }, Cmd.none )

        Err _ ->
          ( { model | data = Failure }, Cmd.none )



---- VIEW ----


view : Model -> Html Msg
view model =
  div []
    [ select [] []
    , div [] [ text (gambinaData model.data) ]
    ]

gambinaData : Data -> String
gambinaData data =
  case data of

    Failure ->
      "Something went wrong!"
        
    Loading ->
      "Loading..."

    Success json ->
      json

        



---- PROGRAM ----


main : Program () Model Msg
main =
  Browser.element
    { view = view
    , init = \_ -> init
    , update = update
    , subscriptions = always Sub.none
    }
