<template>
    <div v-if="!viewcard" class="genrate-qr-conatiner" v-ripple @click="generateCard()">
        Generate My Card
    </div>
        <v-card v-if="viewcard" class="mx-auto" max-width="300">
            <v-card-title class="mx-auto text-center">My card</v-card-title>
            <v-card-text>
                <v-container v-if="viewcard" style="margin-left:15px">
             <qrcode-vue  :value="qrlink" :size="200"  level="H" />
             <v-row style="margin-top:5px; margin-left: 5px; color:black; font-size: large;">
                Balance Amount : {{  amount}}
             </v-row>
            </v-container>
            </v-card-text>
        </v-card>
</template>

<script setup>
import axios from 'axios';
import QrcodeVue from 'qrcode.vue'
const cardNum = ref("")
const qrlink = ref("")
const viewcard = ref(false);
const username = ref("")
const amount = ref(0)


async function generateCard() {
    cardNum.value = String(Math.floor(Math.random() * 1000000000));
    const carddata = {
        user: username.value,
        cardnumber: cardNum.value,
        amount: 200,
        status: ["active"]
    }
    await axios.post(`http://localhost:11001/api/card`, carddata).then(res=>{
        if(res.data.ok === true) {
            console.log(res.data)
            qrlink.value = `http://localhost:3000/cardticket/${res.data.result.cardnumber}`
            viewcard.value = true;
            
        }
        else {
            viewcard.value = false;
        }
    })
}

onMounted(async ()=> {
    username.value =JSON.parse(localStorage.getItem('employee_token'))['user']['username']
        await axios.get(`http://localhost:11001/api/card?user=${username.value}`).then(res=>{
            if(res.data.ok = true) {
                console.log(res.data)
                qrlink.value = `http://localhost:3000/cardticket/${res.data.result.cardnumber}`
                amount.value = res.data.result.amount
                viewcard.value = true;

            }
            else {
            viewcard.value = false;
            }
        })
    })
</script>

<style>

.genrate-qr-conatiner {
    min-width: 300px ;
    max-width: 300px ;
    max-height: 100px;
    border: solid;
    border-radius: 0px;
    display: flex;
    justify-content: center;
    align-self: center;
    margin-left: 35%;
    margin-top: 18%;
    background-color: cyan;
}
</style>