<template>
 <v-card :loading="isUpdating" color="blue-grey-darken-1" class="mx-auto" max-width="420">
    <template v-slot:loader="{ isActive }">
      <v-progress-linear :active="isActive" color="green-lighten-3" height="4" indeterminate></v-progress-linear>
    </template>

    <v-img cover height="200" src="">
    </v-img>
    <v-form>
      <v-row>
        <v-col cols="5" style="margin-left: 20px;">
          <v-autocomplete v-model="source_city" :items="['Mumbai', 'Delhi']" label="City">
          </v-autocomplete>
        </v-col>
        <v-col v-if="cardstatus === 'active'"  cols="5">
          <v-autocomplete v-model="source_station" :items="items" item-title="station_name" item-value="station_id"
            label="Check In">
          </v-autocomplete>
        </v-col>
        <v-col cols="5" v-if="cardstatus === 'checkedin'">
          <v-autocomplete  v-model="destined_station" :items="items" item-title="station_name" item-value="station_id"
            label="Destination">
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-form>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn :loading="isUpdating" :variant="isUpdating ? 'tonal' : undefined" color="blue-grey-lighten-3" @click="handleCardFunction()">
        Next
        <v-dialog transition="dialog-bottom-transition" width="auto" v-model="dialog" >
          <v-card min-width="420">
            </v-card>
        </v-dialog>
      </v-btn>

    </v-card-actions>
  </v-card>
</template>

<script setup>
import axios from 'axios';
import { useRoute } from 'vue-router'


const route = useRoute()
const id = route.params.id
const user = ref("")
const source_city = ref("")
const items = ref([]);
const myToken = ref('')
const source_station = ref('')
const destined_station = ref('')
const isUpdating = ref(false)
const dialog = ref(false)
const cardstatus = ref("")

watch(source_city, async () => {
  source_station.value = ""
  destined_station.value = ""
  await axios.get(`http://localhost:11001/api/station-list?city=${source_city.value}`, { headers: { 'authorization': myToken.value, 'Content-Type': 'application/json' } }).then(res => {
    items.value = res.data
  })
})

async function handleCardFunction() {
    if(cardstatus.value === 'active') {
      const data = {
        city : source_station.value,
        cardnumber: id
      }
      await axios.post(`http://localhost:11001/api/card/checkin`,data).then(res=>{
        if(res.data.ok ) {
          // document.window.reload()
        }
        else {
            alert(res.data.result)
          }
      })
    } 
    else if(cardstatus.value === "checkedin") {
      const data = {
        destination : destined_station.value,
        city: source_city.value,
        cardnumber: id
      }
      await axios.post(`http://localhost:11001/api/card/checkout`,data).then(res=>{
          if(res.data.ok) {
            document.window.reload();
          }
          else {
            alert(res.data.result)
          }
        })
    }
    else {
      alert("Something went wrong ")
    }
}

onMounted(async () => {
    myToken.value = JSON.parse(localStorage.getItem('employee_token'))['token']
    myToken.value = JSON.parse(localStorage.getItem('employee_token'))['token']
    user.value =  myToken.value = JSON.parse(localStorage.getItem('employee_token'))['user']
    await axios.get(`http://localhost:11001/api/card?user=${'manav'}`).then(res=>{
            if(res.data.result.user !== 'manav') {
                navigateTo('/')
            }
            else {
              console.log(res.data)
              cardstatus.value = res.data.result.status[0]
            }
        })
})
</script>
