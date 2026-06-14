import {useState, useEffect} from 'react'
import axios from 'axios'



 const News = () => {
   const [news, setNews] = useState([])

   useEffect(() => {
      const fetchNews = async () => {
          try {
              const response = await axios.get('')
              setNews(response.data)
          }         catch (error) {
              console.error('Error fetching news:', error)
          }
      }
      fetchNews()
   }, [])
  return (
     <div></div>
   )
 }
 
 export default News