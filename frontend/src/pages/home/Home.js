import { useEffect, useState} from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthComponent } from '../../components/AuthComponent';
import HomeWorkoutCard from '../../components/homecards/HomeWorkoutCard';
import './Home.css';
import { Container, Row, Col, Card, Image, Footers } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Alarm, PeopleFill, PersonArmsUp, PersonCircle, GeoAltFill, TelephoneFill, Facebook, Instagram, Git } from 'react-bootstrap-icons';
import CalendarImage from '../../../src/assets/images/calendar.png'
import User2 from '../../../src/assets/images/user2.jpeg'
import User1 from '../../../src/assets/images/user1.jpeg'
import User3 from '../../../src/assets/images/user3.jpg'
import { UseWorkoutsContext } from '../../hooks/UseWorkoutsContext';
import { WorkoutsContext } from '../../context/WorkoutsContext';
import { UseAuthContext } from '../../hooks/UseAuthContext';
import { toast } from 'react-toastify';
import {APIProvider, Map, MapCameraChangedEvent, Marker} from '@vis.gl/react-google-maps';
import { FaBusinessTime, FaSmileBeam } from "react-icons/fa";




const Home = ()=>{

   
    const [recdata, setRecdata] = useState([]);
    const [cardio, setCardio] = useState([]);
    const [cal, setCal] = useState([]);
    const [weight, setWeight] = useState([]);
    const [loader, setLoader] = useState(true);
    const {workouts, dispatch} = UseWorkoutsContext();
    const {user, dispatch:authDispatch} = UseAuthContext();

    
    

    const navigate = useNavigate()

    useEffect(()=>{

        
        if (!user) {

            let fetchGoogle = async()=>{

            let data = await fetch("https://mern-exercise-tracker-production.up.railway.app/auth/protected", {
            //let data = await fetch("http://localhost:4000/auth/protected", {

                credentials: "include",
              })
                .then((res) => res.json())
                .then((data) => {
                    
                    const userr = {"name":data.user.username, "email":data.user.email, "token":data.user.token}
                    console.log(userr)
                    authDispatch({type: 'LOGIN', payload:userr})
                  
                    

                }).catch((error)=>{

                    console.log(error)
                })  
           
            }

            fetchGoogle()

         
        }



    }, [])



    useEffect(()=>{


        const fetchApiData = async()=>{

               const data = await fetch('https://mern-exercise-tracker-production.up.railway.app/api/workout/home',{
               //const data = await fetch('http://localhost:4000/api/workout/home',{

                method: 'GET',

                header: {

                    'Content-Type':'application/json'
                }

            }).then((response)=>{

                return response.json()

            }).then((data)=>{
               
                dispatch({type: 'SET_WORKOUTS', payload: data})
                setLoader(false)
               

            }).catch((error)=>{

                console.log("The error is:", error)
            })
        }

        fetchApiData()





    }, [])

    useEffect(()=>{

        if(workouts !== null){

            setRecdata(workouts.slice(0,4))

            const cardioData = workouts.filter((workout)=>{
            
            return workout.wtype.toLowerCase().includes('cardio');
        
            })
            
            setCardio(cardioData.slice(0 ,4));

            const calData = workouts.filter((workout)=>{
                
                return workout.wtype.toLowerCase().includes('calesthenics');
                
                })
                
                setCal(calData.slice(0 ,4));


            const weightData = workouts.filter((workout)=>{
            
                return workout.wtype.toLowerCase().includes('weight');
                
                })
                
                setWeight(weightData.slice(0 ,4));
            
        }

        
      
       },[workouts])
      
       

    return (
        <AuthComponent>

        <Container className='mt-3'>
            <Row>
                <Col id="banner" md={12}>
                    <h2>Find a workout buddy who matches your schedule</h2>
                </Col>
            </Row>

            <Row className='mt-5'>
                <Col md={12} className='text-center' style={{lineHeight:'30px'}}>
                    <p>Hi :), <br/> I am Raju, fitness has alaways been a priority for me other than my main profession, because
                        I know everything is connected to it, if your body is not fit, then your mind will follow suit and
                        nothing in life will make sense. This app will help you find people around you who has the same workout routine as yours
                    </p>
                </Col>
            </Row>

            <Row style={{padding:'30px 0px'}}>
                <Col md={4} style={{textAlign:'center', padding:'20px 0px'}}>
                    <Alarm style={{fontSize:"40PX"}} />
                    <p>Sync Time</p>
                </Col>
                <Col md={4} style={{textAlign:'center', padding:'20px 0px'}}>
                <PeopleFill style={{fontSize:"40PX"}} />
                <p>Find Community</p>
                </Col>
                <Col md={4} style={{textAlign:'center', padding:'20px 0px'}}>
                <PersonArmsUp style={{fontSize:"40PX"}} />
                <p>Workout Buddy</p>
                </Col>
                
            </Row>

            {loader &&  (

                <Button variant="default" disabled>
                <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
                />
                Loading...
                </Button>
                )}

            <Row className='mt-5'>
                <h5>Recent Schedule</h5>
              

                {
                    
                    recdata && recdata.map((singleWorkout)=>{
           
                           return (
                           
                               <HomeWorkoutCard key={singleWorkout._id} props={singleWorkout} />
                           )
                       })            
                                   
                              
                   }

              
            </Row>

            <Row className='mt-4'>
            <h5>Cardio</h5>
              

                {
                    
                    cardio && cardio.map((singleWorkout)=>{
           
                           return (
                           
                               <HomeWorkoutCard key={singleWorkout._id} props={singleWorkout} />
                           )
                       })            
                                   
                              
                   }

              
            </Row>

                  

            <Row className='mt-4' style={{padding:'50px 0px'}}>
            <h5>Recent WorkOut Locations</h5>

            <Map
                style={{width: '100vw', height: '50vh'}}
                defaultCenter={{lat: 45.48556, lng: -73.62780}}
                defaultZoom={10}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            />

            <Marker
            position={{lat :45.49548909989325, lng: -73.57798567418627}}
            clickable={true}
            />

            <Marker
            position={{lat:45.5024672813017, lng: -73.56973598768127}}
            clickable={true}
            />

            </Row>

            <Row style={{backgroundColor:'white'}}>
            <Col md={4} style={{textAlign:'center', color:'black', padding:'20px 0px'}}>
                    <FaBusinessTime style={{fontSize:"40PX"}} />
                    <p>TIME FREEDOM</p>
                </Col>
                <Col md={4} style={{textAlign:'center', color:'black',  padding:'20px 0px'}}>
                <GeoAltFill style={{fontSize:"40PX"}} />
                <p>LOTS OF LOCATIONS</p>
                </Col>
                <Col md={4} style={{textAlign:'center', color:'black',  padding:'20px 0px'}}>
                <FaSmileBeam style={{fontSize:"40PX"}} />
                <p>FRIENDLY CROWD</p>
                </Col>

            </Row>

            <Row className='mt-4'>
            <h5>Weights</h5>
              

                {
                    
                    weight && weight.map((singleWorkout)=>{
           
                           return (
                           
                               <HomeWorkoutCard key={singleWorkout._id} props={singleWorkout} />
                           )
                       })            
                                   
                              
                   }

              
            </Row>


            <Row style={{padding:'60px 0px'}}>

            <h5 className='mb-5'>Our Testimonials</h5>

                <Col md={4} style={{textAlign:'center', padding:'20px 10px'}}>
                <Image src={User2} roundedCircle width={130} height={130} />
                    <p>Found an awesome community and workout buddy and never missed a workout till now</p>
                </Col>
                <Col md={4} style={{textAlign:'center', padding:'20px 10px'}}>
                <Image src={User1} roundedCircle width={130} height={130} />
                <p>Could easily find someone someone near who has the same workout timings and type</p>
                </Col>
                <Col md={4} style={{textAlign:'center', padding:'20px 0px'}}>
                <Image src={User3} roundedCircle width={130} height={130} />
                <p>Amazing platform if you are looking for a workout partner and accountability coach, it just transformed my life</p>
                </Col>
                
            </Row>

           


            <Row className='mt-4'>
            <h5>Calisthenics</h5>
              

                {
                    
                    cal && cal.map((singleWorkout)=>{
           
                           return (
                           
                               <HomeWorkoutCard key={singleWorkout._id} props={singleWorkout} />
                           )
                       })            
                                   
                              
                   }

              
            </Row>

           

      
   
 
        </Container>

       

       
               

         
        </AuthComponent>
       
       
    )
}

export default Home;