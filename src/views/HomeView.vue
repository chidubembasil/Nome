<template>
  <HeaderView/>
  <div id="error" ref="error">
    <X/>
    <p>
       Invalid input
    </p>
  </div>
  <main>
    <div id="landingPage">
      <h1>Find it. Try it. <span style="color: var(--primary)">Buy it.</span> Together.</h1>
      <p>Buy, Rent, Invest, Stay — All in one Scillar</p>
      <form action="" method="post">
        <div id="btns">
          <button type="button" id="buy" ref="buyBtn" @click="buyBtnClick">Buy</button>
          <button type="button" id="rent" ref="rentBtn" @click="rentBtnClick">Rent</button>
          <button type="button" id="invest" ref="investBtn" @click="investBtnClick">Invest</button>
          <button type="button" id="stay" ref="stayBtn" @click="stayBtnClick">Stay</button>
        </div>
        <div id="search">
          <input type="text" placeholder="Search for location" v-model="searchInput">
          <button type="submit" id="searchBtn" ref="searchBtn" @click.prevent="searchBtnClick">Search</button>
        </div>
        
      </form>
    </div>
    <div id="cta">

      <div class="ctaDiv">
        <span style="background-color: var(--chart2)">
          <Home color="var(--primary)"/>
        </span>
        <h3>
          Verified Listings
        </h3>
        <p>
          All properties are verified and authenticated for your peace of mind
        </p>
      </div>
      <div class="ctaDiv" >
        <span  style="background-color: var(--chart1)" >
          <Sparkles color="var(--accent)"/>
        </span>
        <h3>
          AI Assistant
        </h3>
        <p>
          Your smart AI assistant for property recommendations and insights
        </p>
      </div>
      <div class="ctaDiv" >
        <span style="background-color: var(--chart2)">
          <Shield color="var(--primary)"/>
        </span>
        <h3>
          Secure Platform
        </h3>
        <p>
          Your data and transactions are protected with bank-level security
        </p>
      </div>
       
    </div>
   <!--  <div id="featured" >
      <div id="textDiv">
        <div id="text">
          <h2>Featured Properties</h2>
          <p>Handpicked properties just for you</p>
        </div>
        <router-link to="/listing" class="view-all-link">View All </router-link>
      </div>
      <div id="featuredItems" ref="featuredItems">
        
      </div>
    </div> -->

  </main>
  <FooterView/>
</template>


<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import axios from 'axios';
  import * as Ably from 'ably'; // ✅ Updated Ably import
  import HeaderView from '../components/HeaderView.vue';
  import FooterView from '../components/FooterView.vue';
  import { useRouter } from 'vue-router';
  import { Home, Sparkles, Shield, X } from 'lucide-vue-next';

  // --- Refs ---
  const buyBtn = ref(null);
  const rentBtn = ref(null);
  const investBtn = ref(null);
  const stayBtn = ref(null);
  const searchBtn = ref(null);
  const searchInput = ref('');
  const error = ref(null);

  // --- Router ---
  const router = useRouter();

  // --- Ably Realtime Setup ---
  let ablyRealtime = null;
  let channel = null;

  onMounted(() => {
    ablyRealtime = new Ably.Realtime({
      key: 'RSTb1g.Dg9vCg:IYEo1Otd0e1OLvKynv_go5Ma3LvCEa2R1ln7KLwhRk8'
    });
    channel = ablyRealtime.channels.get('landingpage-events');

    // Subscribe to all events
    channel.subscribe("button-click", msg => {
      console.log("Button clicked:", msg.data);
    });

    channel.subscribe("search", msg => {
      console.log("Search event:", msg.data);
    });
  });

  onUnmounted(() => {
    if (channel) channel.unsubscribe();
    if (ablyRealtime) ablyRealtime.close();
  });

  // --- Button click handlers ---
  function highlightButton(activeBtn) {
    const buttons = [buyBtn, rentBtn, investBtn, stayBtn];
    buttons.forEach(btnRef => {
      if (btnRef === activeBtn) {
        btnRef.value.style.backgroundColor = "var(--card)";
        btnRef.value.style.color = "var(--foreground)";
      } else {
        btnRef.value.style.backgroundColor = "transparent";
        btnRef.value.style.color = "var(--foreground)";
      }
    });
  }

  function buyBtnClick() { highlightButton(buyBtn); publishButton("buy"); }
  function rentBtnClick() { highlightButton(rentBtn); publishButton("rent"); }
  function investBtnClick() { highlightButton(investBtn); publishButton("invest"); }
  function stayBtnClick() { highlightButton(stayBtn); publishButton("stay"); }

  // --- Search handler ---
  async function searchBtnClick() {
    if (!searchInput.value.trim()) {
      error.value.style.display = "flex";
      setTimeout(() => (error.value.style.display = "none"), 1000);
      return;
    }

    // Publish search event via Ably
    publishSearch(searchInput.value);

    // Example Axios search request
    try {
      const response = await axios.get(`/api/search?query=${encodeURIComponent(searchInput.value)}`);
      console.log("Search results:", response.data);

      // Navigate to listing page with results
      router.push({ path: '/listing', query: { q: searchInput.value } });
    } catch (err) {
      console.error("Search failed:", err);
    }
  }

  // --- Ably publishers ---
  function publishButton(name) {
    if (channel) channel.publish("button-click", { button: name });
  }

  function publishSearch(query) {
    if (channel) channel.publish("search", { query });
  }
</script>





<style scoped>
  #error{
    position: absolute;
    top: 12dvh;
    right: 0;
    display: none;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: var(--destructive);
    width: 170px;
    height: 50px;
    background-color: var(--card);
    box-shadow: 0px 2px 5px var(--card-shadow-lg);
  }

  main{
    width: 100%;
    height: fit-content;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--foreground);
    margin-top: 10dvh;

    #landingPage{
      width: 100%;
      height: 90dvh;
      background: url('../assets/img/pexels-elly-fairytale-3807362.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-attachment: fixed;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: var(--foreground);
      gap: 20px;

      h1{
        font-size: 2.5rem;
        
      }


      form{
        width: 70%;
        height: 150px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        background-color: var(--card);
        border-radius: 10px;
        box-shadow: var(--card-shadow);


        #btns{
          width: 95%;
          height: fit-content;
          padding: 5px;
          border-radius: 5px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          background-color: var(--border);

          button{
            width: 100%;
            height: fit-content;
            padding: 0.5rem;
            background-color: transparent;
            color: var(--foreground);
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
          }
          #buy{
            background-color: var(--card);
            color: var(--foreground);
          }
        }
        #search{
          width: 95%;
          height: fit-content;
          padding: 5px;
          border-radius: 5px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          gap: 1rem;

          input{
            width: 100%;
            height: fit-content;
            padding: 10px;
            background-color: var(--card);
            color: var(--foreground);
            border: 1px solid var(--border);
            border-radius: 5px;
            cursor: pointer;
          }
          input:focus{
            outline: 2px solid var(--primary);
            border: none;
          }
          button{
            width: 100%;
            height: fit-content;
            padding: 10px;
            background-color: var(--primary);
            color: var(--primary-foreground);
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
        }

      }

    }

    #cta{
      width: 100%;
      height: fit-content;
      padding-left: 10px;
      padding-top: 20px;
      padding-right: 10px;
      padding-bottom: 20px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      border: 1px solid var(--border);

      .ctaDiv{
        width: 100%;
        height: 350px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;
        
        span{
          width: 60px;
          height: 60px;
          border-radius: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          

        }
        h3{
          width: 90%;
          text-align: center;
        }
        p{
          width: 90%;
          text-align: center;
          color: var(--muted-foreground);

        }
        
      }



    }

    #featured{
      width: 100%;
      height: fit-content;
      padding-left: 10px;
      padding-top: 20px;
      padding-right: 10px;
      padding-bottom: 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;


    }
  }

  @media(max-width: 600px){
    main{
      #landingPage{
        h1{
          font-size: 1.3rem;
          text-align: center;
          padding-left: 10px;
          padding-right: 10px;
        }
        p{
          font-size: 0.8rem;
          margin-bottom: 7px;
        }

        form{
          height: 200px;
          #search{
            display: flex;
            flex-direction: column;
          }
        }
      }
      #featured{
        flex-direction: column;
      }
    }
  }
  @media(max-width: 450px){
    main{
      #landingPage{
        padding-top: 20px;
        height: 110dvh;
        form{
          height: 400px;
          #btns{
            display: flex;
            flex-direction: column;
          }
        }
      }
      #cta{
        flex-direction: column;
        .ctaDiv{
          h3{
            font-size: 0.9rem;
          }
          p{
            font-size: 0.9rem;
          }
        }
      }
      
    }
  }
</style>

