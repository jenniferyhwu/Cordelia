#BostonHacks

## Inspiration
While driving in a new city, you realize that you have arrived at your destination and all the available parking spaces have been taken. You have used up your data for the month and as you pull over, you realize that you can text Cordelia, an SMS-based chat-bot, for nearby parking spaces.

## Meet Cordelia
Cordelia is an SMS-based chat-bot who helps users find parking spaces close to their destination. Users can text Cordelia to initiate a conversation, and after Cordelia asks them a few questions about their preferences and destination, she will offer them a few options for parking.

## How we built it
Cordelia launches when you reach out to her through text message. Given the desired destination. Cordelia then consults the Here API to find the exact geographical coordinates of the destination, which it then passes onto the Shine API that searches for parking options near that destination. Then, it displays these options to you, allowing you to select your preferred parking spot. When you select your parking spot of choice, Cordelia once again consults the Here API to find and select the optimal route to your desired parking space, which it then passes onto you. All this is done entirely through SMS with the aid of the Twilio API - no internet access necessary.

## Challenges we ran into
It was difficult to find an appropriate method to implement the chatbot. We explored Botkit and Twilio to figure out which would best suit our needs.
- Kathleen

A challenge that I didn't see coming was working out async stuff in Node.js - once when integrating Here and Shine APIs, and once again when integrating that with the Twilio API / chatbot. 
- Jennifer 

One of my biggest challenges was finding a way to integrate all of the different API's we had planned to use; originally Botkit, Google Maps, and Shine. The solution we found was to use Here and Twilio as our map and chatbot as they are already well integrated.
- Fatimah

## Accomplishments that we're proud of
Because of the many technologies we mashed together, we were pretty much forced to use Node.js because it was the only one compatible between all the APIs we used. We're proud of how we were able to work with this despite none of us have much experience with it!

Our team is proud of the fact that we were able to work under pressure and tight timelines to meet this deadline. Our ability to debug and continuously refactor our solution meant pushing our ability to collaborate, problem-solve and self-assess looking for areas of improvement. 

## What we learned
Our team learned how to use the APIs for Twilio, Shine and Here in a short period of time. Our team members who had never used node.js before had the opportunity to learn by building, this challenge really helped us learn to self-teach and seek information in different ways. Our team was also able to learn how to manage our time and delegate tasks in order to have everything done in time for submission.

## What's next for Cordelia
Our team found some improvements that could be made to Cordelia that we are looking forward to continuing working on after BostonHacks.

One improvement our team found was giving Cordelia the ability to differentiate between parking spots that are empty and already taken, only suggesting available parking spots to users. This could be implemented using a ParkWhiz API which tracks whether parking spaces are available of not through heat maps. Another way that Cordelia could receive information about whether parking spots are available or not is through crowdsourcing, users could be given the option to let Cordelia know if they arrived at a parking spot that was already taken, or which parking spot they took, Cordelia could then register these locations as temporarily unavailable.

Cordelia’s user experience could also be improved, with a faster response time and responses more tailored to each user. This could be done through the use of tailored user accounts, where users could log in through a web portal and change the interactions they have with Cordelia while looking for a spot. Cordelia can recognize when these users reach out to her and generate her interactions accordingly. We want to improve the UI of Cordelia, which we didn't have time for during the hackathon. 

Our final suggestion for ways that we could build onto Cordelia would be to add a notice at the beginning of every user’s interaction reminding them that texting while driving in the State of Massachusetts is illegal. Users are encouraged to use Cordelia before they leave for their destination, and in the worst case, pull over in order to use Cordelia therefore adding another warning with Cordelia would encourage safe driving behaviour.

## Built With
Twilio API, Here.com API, Shine API, Node.js, JavaScript




