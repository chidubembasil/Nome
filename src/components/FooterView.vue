<template>
    <footer>
        <NessaAi/>
        <div id="footer1">
            <ul>
                <h3><Home color="var(--primary)"/>Nomes</h3>
                <li>Your Property Journey Starts Here. Buy, Rent, <br> Invest — All in one Nome.</li>
                
            </ul>
           
            <ul>
                <h3>Quick Link</h3>
                <li>
                    <router-link to="/" class="router">Home</router-link>
                </li>
                 <li>
                    <router-link to="/listing" class="router">Listing</router-link>
                </li>
                <li>
                    <router-link to="/feed" class="router">News feed</router-link>
                </li>
                 <li>
                    <router-link to="/about" class="router">About</router-link>
                </li>
                
                 <li>
                    <router-link to="/upload" class="router">Upload</router-link>
                </li>
                 <li>
                    <router-link to="/favorite" class="router">Favorite</router-link>
                </li>
                 <li>
                    <router-link to="/profile" class="router">Profile</router-link>
                </li>
                 <li>
                    <router-link to="/payment" class="router">Payment</router-link>
                </li>
                 <li>
                    <router-link to="/notification" class="router">Notification</router-link>
                </li>
               
            </ul>
            <ul>
                <h3>Property Types</h3>
                <li>
                    <router-link to="/listing" class="router">Buy Properties</router-link>
                </li>
                <li>
                    <router-link to="/listing" class="router">Rent Properties</router-link>
                </li>
                <li>
                    <router-link to="/listing" class="router">Investment Opportunities</router-link>
                </li>
                <li>
                    <router-link to="/listing" class="router">Vacation Stay</router-link>
                </li>
            </ul>
             
        </div>
        <div id="footer2">
            &copy; 2025 Nome Real Estate. All rights reserved.
        </div>
    </footer>
</template>
<script setup >
import { Home } from 'lucide-vue-next';
import NessaAi from '../components/NessaAi.vue'

</script>

<style scoped>
footer{
    width: 100%;
    height: 520px;
    padding: 20px;
    background-color: var(--footer);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
   



    #footer1{
        width: 95%;
        height: 400px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 1px solid var(--border);
        
        ul{
            list-style-type: none;

            h3{
                display: flex;
                flex-direction: row;
                align-items: center;
                color: var(--foreground);
                gap: 5px;
            }

            li{
                color: var(--foreground);
                padding-top: 10px;

                .router{
                    color: var(--foreground);
                    text-decoration: none;

                    &:hover{
                        color: var(--primary);
                    }
                }

            }

        }
    }
    hr{
        border: 1px solid var(--border);
    }
    #footer2{
        width: 95%;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--foreground);
    }
}

@media(max-width: 600px){
    footer{
        height: 690px;
        #footer1{
            height: 530px;
            flex-direction: column;
            padding-bottom: 20px;
            justify-content: center;
            gap: 20px;
           

            ul{
                font-size: 0.8rem;


            }
        }
        #footer2{
            text-align: center;
            font-size: 0.8rem;
        }
        
    }
  }
</style>