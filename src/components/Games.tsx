import React, { JSX } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { Colors } from "../styles/colors";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Coordinate, Direction, GestureEventType } from "../types/Types";
import Snake from "./Snake";
import { CheckGameOver } from "../utils/CheckGameOver";
import Food from "./Food";
import { CheckEatsFood } from "../utils/CheckEatsFood";
import { RandomFoodPosition } from "../utils/RandomFoodPosition";

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
const GAME_BOUNDS = { xMin: 0, xMax: 34, yMin: 0, yMax: 70 };
const MOVE_INTERVAL = 50;
const SCORE_INCREMENT = 10;



export default function Games(): JSX.Element {

  const [direction, setDirection] = React.useState<Direction>(Direction.Right);
  const [snake, setSnake] = React.useState<Coordinate[]>(
    SNAKE_INITIAL_POSITION
  );
  const [food, setFood] = React.useState<Coordinate>(FOOD_INITIAL_POSITION);

  const [isGameOver, setIsGameOver] = React.useState<boolean>(false);
  const [isPaused, setIsPaused] = React.useState<boolean>(false);
  const [score, setScore] = React.useState<number>(0);
  

  React.useEffect(() => {
     if (!isGameOver){
      const intervalid = setInterval(() => {
        !isPaused && moveSnake();
      }, MOVE_INTERVAL);
      return () => clearInterval(intervalid);
     }
  }, [snake, isGameOver, isPaused]);
  



  const handleGesture = (event: GestureEventType) =>{
      const {translationX, translationY} = event.nativeEvent;
      
      if (Math.abs(translationX) > Math.abs(translationY)){
        if(translationX > 0){
          //Moving right
          setDirection(Direction.Right);
        } else {
          //Moving left 
          setDirection(Direction.Left);
        }

      }else {
        if (translationY > 0){
          // down
          setDirection(Direction.Down);
        } else{
          // up
          setDirection(Direction.Up);
        }
      }
  };


    const  moveSnake  = () =>{
      const snakeHead = snake[0];
      const newHead = {...snakeHead}; //creating a copy 

    

      if (CheckGameOver(snakeHead, GAME_BOUNDS)){
         setIsGameOver((prev) => !prev); // so it can run once
          return;
      }

      switch (direction){
        case Direction.Up:
          newHead.y -= 1;
          break;
        case Direction.Down:
          newHead.y += 1;
          break;
        case Direction.Left:
          newHead.x -= 1;
          break;
        case Direction.Right:
          newHead.x += 1;
          break;
          default:
          break;
      }

      if (CheckEatsFood(newHead, food, 2)){
        setFood(RandomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax));
        setSnake([newHead, ...snake]);
        setScore(score + SCORE_INCREMENT)
      } else {
        setSnake([newHead, ...snake.slice(0, -1)]);
      }
      
    }

  return ( 
    <PanGestureHandler onGestureEvent={handleGesture}>
         <SafeAreaView style={styles.container}>
          <View style={styles.boundaries}>
            <Snake snake={snake}/>
            <Food x={food.x} y={food.y}/>
          </View>
         </SafeAreaView>
    </PanGestureHandler>
  )
};

const styles = StyleSheet.create ({
  container:{
    flex : 1,
    backgroundColor: Colors.primary
  },
  
  boundaries:{
    flex: 1,
    height: 100,
    // borderBottomLeftRadius: 30,
    // borderBottomRightRadius: 30,
    borderBottomWidth: 50,
    borderColor: Colors.primary,
    borderWidth: 12,
    borderTopWidth: 50,
    backgroundColor: Colors.background,
    overflow: 'hidden'
  },


});
