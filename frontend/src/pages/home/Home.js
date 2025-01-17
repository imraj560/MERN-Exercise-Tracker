import { useEffect, useState} from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthComponent } from '../../components/AuthComponent';
import HomePlaceCard from '../../components/homecards/HomePlaceCard';
import './Home.css';
import { Container, Row, Col, Card, Image, Footers } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Alarm, PeopleFill, PersonArmsUp, PersonCircle, GeoAltFill, TelephoneFill, Facebook, Instagram, Git } from 'react-bootstrap-icons';
import CalendarImage from '../../../src/assets/images/calendar.png'
import User2 from '../../../src/assets/images/user2.jpeg'
import User1 from '../../../src/assets/images/user1.jpeg'
import User3 from '../../../src/assets/images/user3.jpg'
import { UsePlaceContext } from '../../hooks/UsePlaceContext';
import { PlaceContext } from '../../context/PlaceContext';
import { UseAuthContext } from '../../hooks/UseAuthContext';
import { toast } from 'react-toastify';
import {APIProvider, Map, MapCameraChangedEvent, Marker, APILoadingStatus} from '@vis.gl/react-google-maps';
import { FaBusinessTime, FaSmileBeam } from "react-icons/fa";
import { FaMountainSun } from "react-icons/fa6";
import { GiTreeBranch } from "react-icons/gi";
import { IoIosWater } from "react-icons/io";
import { FaCalendar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import imageOne from '../../../src/assets/images/imageOne.jpg'
import imageTwo from '../../assets/images/imageTwo.jpg'
import imageThree from '../../assets/images/imageThree.jpg'
import bangladesh from '../../assets/images/bangladesh.jpg'
import turkey from '../../assets/images/turkey.jpg'
import scotland from '../../assets/images/scotland.jpg'







const Home = ()=>{

   
    const [recdata, setRecdata] = useState([]);
    const[mapdata, setMapdata] = useState([]);
    const [cardio, setCardio] = useState([]);
    const [cal, setCal] = useState([]);
    const [weight, setWeight] = useState([]);
    const [loader, setLoader] = useState(true);
    const {place, dispatch} = UsePlaceContext();
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


    /**Fetch all Places */
    useEffect(()=>{


        const fetchApiData = async()=>{

               const data = await fetch('https://mern-exercise-tracker-production.up.railway.app/api/place/home',{
               //const data = await fetch('http://localhost:4000/api/place/home',{

                method: 'GET',

                header: {

                    'Content-Type':'application/json'
                }

            }).then((response)=>{

                return response.json()

            }).then((data)=>{
               
                dispatch({type: 'SET_PLACE', payload: data})
                setLoader(false)
               

            }).catch((error)=>{

                console.log("The error is:", error)
            })
        }

        fetchApiData()





    }, [])

    /**Fetch google map markers */

    useEffect(()=>{

        if(place !== null){

            setRecdata(place.slice(0,12))
            setMapdata(place);
          
        } 
      
       },[place])

       
       

    return (
        <AuthComponent>

        <Container>
            <Row id="banner"></Row>


            <Row id="call_one">

                <Col md={6} id="call_one_heading">

                <h1>Join our Vibrant Travel Community</h1>

                </Col>

                <Col md={6} id="call_one_text">

                 <p>Discover Variety of places to visit. Connect with like minded individuals and elevate your travel journey</p>
                 <Button id="button_one"><NavLink style={{textDecoration:'none', color:'white'}} to="/signup">Join</NavLink></Button> 
                 <Button id="button_two"><NavLink style={{textDecoration:'none', color:'black'}} to="/find">Find</NavLink></Button>
                 

                </Col>
               
                
            </Row>

            <Row id="explore">

                <p>Explore</p>
                <h2>Discover The Perfect Place For You To Visit Today</h2>
                <p>Our community offers various places to visit. From the rural places of Malaysia to blue seas of the Carribean. We have places listed for
                    everyone
                </p>

            </Row>

            <Row id="service">

                <Col class="service_col" md={6} sm={12} lg={4}>
                <Image src={imageOne} fluid />
                <FaMountainSun style={{fontSize:'40px', marginBottom:'15px', marginTop:'20px'}}/>
                <h2 class="service_heading">Beautiful Mountains To Hike</h2>
                <p>Boost your endurance and cardiovascular health with our beautiful hiking session</p>
                </Col>

                <Col class="service_col" md={6} sm={12} lg={4}>
                <Image src={imageTwo} fluid />
                <GiTreeBranch style={{fontSize:'40px', marginBottom:'15px', marginTop:'20px'}}/>
                <h2 class="service_heading">Lush Green Vegetation To Stroll</h2>
                <p>Boost your endurance and cardiovascular health with our beautiful hiking session</p>
                </Col>

                <Col class="service_col" md={6} sm={12} lg={4}>
                <Image src={imageThree} fluid />
                <IoIosWater style={{fontSize:'40px', marginBottom:'15px', marginTop:'20px'}}/>
                <h2 class="service_heading">Amazing Nature Around You</h2>
                <p>Boost your endurance and cardiovascular health with our beautiful hiking session</p>
                </Col>

                
            </Row>

            <Row id="service_button_row">
                <Button id="service_button"><NavLink style={{textDecoration:'none', color:'white'}} to="/find">Find A Place</NavLink></Button>
            </Row>

            <Row id="gallery_title">
                <p>Gallery</p>
                <h2>We Have A Collection Of Amazing Places For You</h2>
                <p>We have an amazing collection of places which people of all around the world has posted</p>
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
              

                {
                    
                     recdata.map((singleWorkout)=>{
           
                           return (
                           
                               <HomePlaceCard key={singleWorkout._id} props={singleWorkout} />
                           )
                       })            
                                   
                              
                   }

              
            </Row>

       

            <Row id="map_title_div">

                <Col md={6}>
                    <h2 id="map_title_heading">Recent WorkOut Locations</h2>
                    <p style={{marginBottom:'0px'}}>All your recently updated Locations</p>
                </Col>

                <Col md={6} style={{height:'100%', marginTop:'auto'}}>

                <Button id="map_title_button" style={{width:'20%', float:'end'}}><NavLink style={{textDecoration:'none', color:'white'}} to="/find">Gallery</NavLink></Button>

                </Col>
                

            </Row>

                  

            <Row id="googleMap">

            <Map
                style={{width: '100%', height: '50vh'}}
                defaultCenter={{lat: 45.48556, lng: -73.62780}}
                defaultZoom={10}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            >

                {

                 mapdata.map((singleMap, index)=>{
                        
                    return (
                    
                        <Marker key={index} position={{lat:Number(singleMap.location_lat), lng:Number(singleMap.location_lng)}} />
                    )
                })     

                }  
                

            </Map>


            

               


           

          

            </Row>


            <Row id="testimonial_div_title">

                <h2>Peoples Opinion</h2>
                <p>Some thoughts from your users reagarding our community</p>

            </Row>





            <Row id="testimonial">


                <Col  md={6} sm={12} lg={4} style={{textAlign:'center', padding:'20px 10px'}} >
                <Image src={User2} roundedCircle width={130} height={130} />
                    <h2 class="name_title">Raju Ahmed</h2>
                    <p>Found an awesome community and workout buddy and never missed a workout till now</p>
                </Col>
                <Col  md={6} sm={12} lg={4} style={{textAlign:'center', padding:'20px 10px'}}>
                <Image src={User1} roundedCircle width={130} height={130} />
                <h2 class="name_title">Islam Makhachev</h2>
                <p>Could easily find someone someone near who has the same workout timings and type</p>
                </Col>
                <Col  md={6} sm={12} lg={4} style={{textAlign:'center', padding:'20px 0px'}}>
                <Image src={User3} roundedCircle width={130} height={130} />
                <h2 class="name_title">Mahruf Ahmad</h2>
                <p>Amazing platform if you are looking for a workout partner and accountability coach</p>
                </Col>
                
            </Row>

            <Row id="favourite_div_title">

            <h2>Favourite Locations</h2>
            <p>Some of your most visited Places</p>

            </Row>


            <Row id="favourite">

                <Col  md={6} sm={12} lg={4}>

                <Card style={{ width: '100%' }}>
                <Card.Img variant="top" src={bangladesh} />
                <Card.Body>
                    <Card.Title style={{fontFamily:"Poppins", fontWeight:"600", fontSize:'30PX'}}>Bangladesh</Card.Title>
                    <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                    <p style={{marginTop:'10px'}}><FaCalendar/>: 22/4/2024</p>
                    <p><FaLocationDot/>: Dhaka, Bangladesh</p>
                    </Card.Text>
                   
                </Card.Body>
                </Card>
                
                </Col>

                <Col  md={6} sm={12} lg={4}>

                <Card style={{ width: '100%' }}>
                <Card.Img variant="top" src={turkey} />
                <Card.Body>
                    <Card.Title style={{fontFamily:"Poppins", fontWeight:"600", fontSize:'30PX'}}>Turkey</Card.Title>
                    <Card.Text>
                    Turkey was home to several ancient places & civilizations, including the Hittitess
                    <p style={{marginTop:'10px'}}><FaCalendar/>: 20/1/2020</p>
                    <p><FaLocationDot/>: Istanbul, Turkey</p>
                    </Card.Text>
                   
                </Card.Body>
                </Card>
                
                </Col>

                <Col  md={6} sm={12} lg={4}>

                <Card style={{ width: '100%' }}>
                <Card.Img variant="top" src={scotland} />
                <Card.Body>
                    <Card.Title style={{fontFamily:"Poppins", fontWeight:"600", fontSize:'30PX'}}>Scotland</Card.Title>
                    <Card.Text>
                    Glasgow stands out as a cultural and musical hub for the whole world
                    <p style={{marginTop:'10px'}}><FaCalendar/>: 6/7/2024</p>
                    <p><FaLocationDot/>: Glasgow, Scotland</p>
                    </Card.Text>
                   
                </Card.Body>
                </Card>
                
                </Col>

               

            </Row>

           

           

      
   
 
        </Container>

       

       
               

         
        </AuthComponent>
       
       
    )
}

export default Home;