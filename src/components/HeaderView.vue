<script setup >
    import { Home, Menu, X, Heart, Sun, Moon } from 'lucide-vue-next' 
    import { ref, onMounted } from 'vue' // Import onMounted for initial theme check
    // Import User icon which was used in the template but not imported
    import { User, Bell } from 'lucide-vue-next' 

    const headerHeight = ref('10dvh')
    const isSwitch = ref(false)
    const isDarkMode = ref(false) // New state for dark mode

    /* --- Theme Toggling --- */
    const setDarkMode = (isDark) => {
        isDarkMode.value = isDark;
        if (isDark) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }

    const toggleTheme = () => {
        setDarkMode(!isDarkMode.value);
    }

    onMounted(() => {
        // 1. Check local storage for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
        } else {
            // Default to light mode if nothing is saved or if saved as 'light'
            setDarkMode(false);
        }

        // Add a check to ensure the header starts at 10dvh if menu is not open (important for initial load)
        headerHeight.value = isSwitch.value ? "fit-content" : '10dvh';
    })
    /* ----------------------- */

    function toggleMenu() {
        isSwitch.value = !isSwitch.value
        headerHeight.value = "fit-content";
    }
    function closeMenu() {
        isSwitch.value = false
        headerHeight.value = '10dvh' // shrink height when menu closes
    }
    
    /* The commented routing functions are omitted for brevity */
</script>

<template>
    <header class="glass" ref="header" :style="{ height: headerHeight }">
        <div id="large">
            <router-link to="/" id="logo">
                <Home/>
                <h2>Nomes</h2>
            </router-link>
            <ul id="nav">
                <li>
                    <router-link to="/"  >Home</router-link>
                </li>
                 <li>
                    <router-link to="/feed"  >Feed</router-link>
                </li>
                 <li>
                    <router-link to="/create"  >Create</router-link>
                </li>
                <li>
                    <router-link to="/listing" >Listing</router-link>
                </li>
                <li>
                    <router-link to="/about"  >About</router-link>
                    
                </li>
               
               
            </ul>
            <ul id="nav2">
                <li>
                    <button @click="toggleTheme" class="icon theme-toggle-btn">
                        <Moon v-if="!isDarkMode" size="17" />
                        <Sun v-else size="17" />
                    </button>
                </li>
                <li>
                    <router-link to="/notification" class="icon" > <Bell size="17" id="bell" /></router-link>
                </li>
                <li>
                    <router-link to="/favorite" class="icon" > <Heart size="17" id="heart" /></router-link>
                </li>
                <li id="profile" ref="profile">
                    <router-link to="/profile" class="icon"><User size="17" id="user" /></router-link>
                </li>
                <li>
                    <router-link to="/auth" id="joinBtn" style="color: #ffffff"> <User size="17" id="userBtn" /> Join</router-link>
                </li>
            </ul>
            <button id="menuBtn" v-if="!isSwitch" @click="toggleMenu">
                <Menu size="17" id="menu" />
            </button>
            <button id="closeBtn" v-if="isSwitch" @click="closeMenu">
                <X size="17" id="close"/>
            </button>

        </div>
        <div id="small" v-if="isSwitch">
            <ul>
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/feed">Feed</router-link></li>
                <li><router-link to="/create">Create</router-link></li>
                <li><router-link to="/listing">Listing</router-link></li>
                <li><router-link to="/favorite">Favorite</router-link></li>
                <li><router-link to="/notification">Notification</router-link></li>
                <li><router-link to="/about">About</router-link></li>
            
                
                <li><router-link to="/profile">Profile</router-link></li> <li><router-link to="/auth">Join</router-link></li>
                <li>
                    <button @click="toggleTheme" class="mobile-theme-toggle">
                        <span v-if="!isDarkMode">Switch to Dark Mode <Moon size="17" style="margin-left: 5px;"/></span>
                        <span v-else>Switch to Light Mode <Sun size="17" style="margin-left: 5px;"/></span>
                    </button>
                </li>
            </ul>
        </div>

        
    </header>
</template>

<style scoped>
    /* Add User icon import to script setup */

    header{
        width: 100%;
        background: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        border: none;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        padding: 20px;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;

        #large{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 100%;
            #logo{
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color:var(--logo    );
            text-decoration: none;
        }
        #nav{
            display: flex;
            align-items: center;
            gap: 2rem;
            list-style: none;
            width: 20%; /* Keep this width relative to the rest of the content */

            li{
                width: 100%;
                a{
                    color:var(--foreground);
                    text-decoration: none;
                }

                a:hover{
                    border-bottom: 2px solid var(--primary);
                }

                
            }

        }
        #nav2{
            display: flex;
            align-items: center;
            gap: 2rem;
            list-style: none;
            

            li{
                
                a, button.icon{ /* Apply styling to the new theme button */
                    color:var(--foreground);
                    text-decoration: none;
                    border: none; /* Remove default button border */
                    background-color: transparent; /* Remove default button background */
                    padding: 0; /* Remove default padding */
                    cursor: pointer;
                }
                .icon{
                    width: 30px;
                    height: 30px;
                    border-radius: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .icon:hover{
                    background-color: var(--accent);
                    color: var(--accent-foreground);
                }
            }
            #profile{
                /* The User icon was not imported in the script, I have added it now */
                display: none;
            }
            #joinBtn{
                display: flex;
                align-items: center;
                flex-direction: row;
                justify-content: center;
                gap: 0.5rem;
                width: 100px;
                height: 30px;
                background-color: var(--primary);
                color: var(--foreground);
                text-decoration: none;
                border-radius: 5px;
                cursor: pointer;
                border: none; /* Ensure button styling is consistent if this was changed to a button later */
                
                /* #userBtn{

                }*/ 
            }
        }
        #menuBtn{
            
            width: 30px;
            height: 30px;
            border-radius: 5px;
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            background-color: transparent;
            border: none;
            

            #menu{
                width: 20px;
                height: 20px;
                color: var(--foreground);
            }
        }
        #closeBtn{
            width: 30px;
            height: 30px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            background-color: transparent;
            border: none;
            
            &:hover{
                background-color: var(--accent);
            }
            #close{
                width: 20px;
                height: 20px;
                color: var(--foreground);

                &:hover{
                    color: var(--accent-foreground);
                }
            }

        }
        }
        #small{
            width: 100%;
            height: fit-content;
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            
            ul{
                width: 90%;
                list-style-type: none;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: start;
                gap: 1rem;

                li{
                    width: 100%;
                    a{
                        width: 100%;
                        color:var(--foreground);
                        text-decoration: none;

                        &:hover{
                            border: none;
                            border-radius: 5px;
                            background-color: var(--border);
                        }
                    }
                    button.mobile-theme-toggle {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 10px 0;
                        color: var(--foreground);
                        text-decoration: none;
                        background: none;
                        border: none;
                        cursor: pointer;
                    }
                    button.mobile-theme-toggle:hover {
                         border-radius: 5px;
                         background-color: var(--border);
                    }
                }
            }
        }
    }
    @media (max-width: 800px) {
        header{
            #large{
               #nav{
                display: none;
               }
               #nav2{
                display: none;
               }
               #menuBtn{
                    display: flex;
                    &:hover{
                        background-color: var(--accent);
                    }

                }
                #closeBtn{
                    &:hover{
                        background-color: var(--accent);
                    }
                }
            }
        }
    }

    /* ---------------------------------------------------- */
    /* NOTE: THEME SWITCHING REQUIRES CSS VARIABLES ON BODY */
    /* ---------------------------------------------------- */
    /*
        For the theme switch to work, your global CSS (or App.vue styles) must define 
        CSS variables like --foreground, --primary, --glass-bg, etc., and then 
        re-define them inside a .dark-mode selector on the body.

        Example Global CSS Structure (Place this in your main CSS file or App.vue style block):

        :root {
            --foreground: #000000;  // Light Mode default text
            --background: #ffffff;  // Light Mode default background
            --primary: #1a4fff;     // Light Mode primary color
            --glass-bg: rgba(255, 255, 255, 0.7);
            --glass-blur: blur(10px);
            
            // ... other light mode variables
        }

        body.dark-mode {
            --foreground: #ffffff; // Dark Mode text
            --background: #1a1a1a; // Dark Mode background
            --primary: #3c77ff;    // Dark Mode primary color (slightly adjusted)
            --glass-bg: rgba(26, 26, 26, 0.7);
            --glass-blur: blur(10px);

            // ... other dark mode variables
        }
    */
</style>