<template>
  <v-card :loading="isUpdating" color="blue-grey-darken-1" class="mx-auto" max-width="420">
    <template v-slot:loader="{ isActive }">
      <v-progress-linear :active="isActive" color="green-lighten-3" height="4" indeterminate></v-progress-linear>
    </template>

    <v-img cover height="200" src="">
    </v-img>
    <v-form>
      <v-row>
        <v-col cols="4">
          <v-autocomplete v-model="source_city" :items="['Mumbai', 'Delhi']" label="City">
          </v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-autocomplete v-model="source_station" :items="items" item-title="station_name" item-value="station_id"
            label="Source">
          </v-autocomplete>
        </v-col>
        <v-col cols="4">
          <v-autocomplete v-model="destined_station" :items="items" item-title="station_name" item-value="station_id"
            label="Destination">
          </v-autocomplete>
        </v-col>
      </v-row>


    </v-form>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn :loading="isUpdating" :variant="isUpdating ? 'tonal' : undefined" color="blue-grey-lighten-3"
        @click="getTicketDetails()">
        Next
        <v-dialog transition="dialog-bottom-transition" width="auto" v-model="dialog" activator="parent">
          <v-card min-width="420">
            <v-toolbar color="primary" title="Your Ticket Details"></v-toolbar>
            <v-card-text>
              <v-container>
                <v-row>
                  Ticket Id: {{ ticket_id }}
                </v-row>
                <v-row>
                  <v-col class="text-h6 pa-2">
                    From
                  </v-col>
                  <v-col class="text-h6 pa-2">
                    Destination
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="text-h6 pa-2">
                    {{ source }}
                  </v-col>
                  <v-col class="text-h6 pa-2">
                    {{ destination }}
                  </v-col>
                </v-row>
                <!-- <v-row>
                    Created At <span style="font-size: 12px; font-weight: bold; margin-left: 10px; margin-top: 3px;">{{ created_at }}</span>
                    </v-row>
                <v-row>
                  Valid Upto <span style="font-size: 12px; font-weight: bold; margin-left: 10px; margin-top: 3px;">{{ valid_upto }}</span>
                </v-row> -->
              </v-container>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn variant="outlined" color="primary" @click="payTicket()" id="rzp-button1">PAY {{ ticket_fare
              }}</v-btn>
              <!-- <script src="https://checkout.razorpay.com/v1/checkout.js"></script> -->
              <v-btn variant="text" @click="dialog = false">CANCEL</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-btn>

    </v-card-actions>
  </v-card>
  <v-card class="mx-auto mt-10" max-width="100%">
    <v-toolbar color="secondary" class="toolbar-style">
      <v-toolbar-title >My Tickets</v-toolbar-title>

      <!-- <v-spacer></v-spacer> -->
    </v-toolbar>
    <v-container fill-height fluid>
      <v-row>
        <v-col cols="4">
          <v-list lines="two">
            <v-list-subheader inset color="green" font="bold"> Active Tickets</v-list-subheader>
            <v-list-item v-for="ticket in activeTickets" :key="ticket.ticket_id">
              <v-list-item-title>
                <v-card>
                  <v-card-title  class="ml-0" style="font-size: medium; background-color: cyan; padding: 0px 0px 0px 3px; border-radius: 10px;" >JOURNEY (E-Ticket)</v-card-title>
                  <v-card-text style="padding: 0px;">
                    <v-container fluid fill-height style=" padding: 0px; padding-top: 5px;" >
                      <v-row no-gutters >
                        <v-col >
                          <div>
                          <span style="color: green">{{ ticket.source }}</span> >> <span style="color: red">{{ ticket.destination }}</span>
                          </div>
                        </v-col>
                        <v-spacer></v-spacer> 
                        <v-col >
                          Fare: 20
                        </v-col>
                        </v-row>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-list-item-title>
              <v-list-item-subtitle style="color: green">
                {{ ticket.status }}
              </v-list-item-subtitle>
              <template v-slot:append :key="ticket.ticket_id">
                <v-btn color="grey-lighten-1" variant="text" :append-icon="mdiInformation" @click="viewTicket(ticket)"
                  :key="ticket.ticket_id">
                  <v-dialog transition="dialog-bottom-transition" width="auto" v-model="viewTicketDialog"
                    :key="ticket.ticket_id">
                    <v-card min-width="420">
                      <v-toolbar color="primary" title="Your Ticket Details"></v-toolbar>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            Ticket Id: {{ dialogTicket.ticket_id }}
                          </v-row>
                          <v-row>
                            <v-col class="text-h6 pa-2">
                              From
                            </v-col>
                            <v-col class="text-h6 pa-2">
                              Destination
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="text-h6 pa-2">
                              {{ dialogTicket.source }}
                            </v-col>
                            <v-col class="text-h6 pa-2">
                              {{ dialogTicket.destination }}
                            </v-col>
                          </v-row>
                          <v-row>
                            Created At <span
                              style="font-size: 12px; font-weight: bold; margin-left: 10px; margin-top: 3px;">{{
                                dialogTicket.created_at }}</span>
                          </v-row>
                          <v-row>
                            Valid Upto <span
                              style="font-size: 12px; font-weight: bold; margin-left: 10px; margin-top: 3px;">{{
                                dialogTicket.valid_upto }}</span>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-autocomplete v-if="dialogTicket.status === 'active'" v-model="check_in_station" :items="check_in_station_obj"
                          item-title="check_in_station_name" item-value="check_in_station_id" label="Check In From">
                        </v-autocomplete>
                        <v-autocomplete v-if="dialogTicket.status === 'checkedin'" v-model="check_out_station"
                          :items="items" item-title="station_name" item-value="station_id" label="Check Out From">
                        </v-autocomplete>
                        <v-btn v-if="dialogTicket.status === 'active'" variant="text"
                          @click="checkInTicket(dialogTicket)">Check In</v-btn>
                        <v-btn v-else-if="dialogTicket.status === 'checkedin'" variant="text"
                          @click="checkOutTicket(dialogTicket)">Check Out</v-btn>
                        <v-btn v-else variant="text">Checked Out</v-btn>
                        <v-btn variant="text" @click="viewTicketDialog = false">Close</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog></v-btn>
              </template>
            </v-list-item>
            <v-divider inset></v-divider>
    </v-list>
        </v-col>
        <v-col cols="4">
          <v-list lines="two">
            <v-list-subheader inset color="yellow" font="bold"> CheckedIn Tickets</v-list-subheader>
            <v-list-item v-for="ticket in checkedInTickets" :key="ticket.ticket_id">
              <v-list-item-title>
                <v-card>
                  <v-card-title  class="ml-0" style="font-size: medium; background-color: cyan; padding: 0px 0px 0px 3px; border-radius: 10px;" >JOURNEY (E-Ticket)</v-card-title>
                  <v-card-text style="padding: 0px;">
                    <v-container fluid fill-height style=" padding: 0px; padding-top: 5px;" >
                      <v-row no-gutters >
                        <v-col >
                          <div>
                          <span style="color: green">{{ ticket.source }}</span> >> <span style="color: red">{{ ticket.destination }}</span>
                          </div>
                        </v-col>
                        <v-spacer></v-spacer> 
                        <v-col >
                          Fare: 20
                        </v-col>
                        </v-row>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-list-item-title>
              <v-list-item-subtitle style="color: magenta">
                {{ ticket.status }}
              </v-list-item-subtitle>
              <template v-slot:append :key="ticket.ticket_id">
                <v-btn color="grey-lighten-1" variant="text" :append-icon="mdiInformation" @click="viewTicket(ticket)"
                  :key="ticket.ticket_id">
                  <v-dialog transition="dialog-bottom-transition" width="auto" v-model="viewTicketDialog"
                    :key="ticket.ticket_id">
                    <v-card min-width="420">
                      <v-toolbar color="primary" title="Your Ticket Details"></v-toolbar>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            Ticket Id: {{ dialogTicket.ticket_id }}
                          </v-row>
                          <v-row>
                            <v-col class="text-h6 pa-2">
                              From
                            </v-col>
                            <v-col class="text-h6 pa-2">
                              Destination
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="text-h6 pa-2">
                              {{ dialogTicket.source }}
                            </v-col>
                            <v-col class="text-h6 pa-2">
                              {{ dialogTicket.destination }}
                            </v-col>
                          </v-row>
                          <v-row>
                            Created At <span
                              style="font-size: 12px; font-weight: bold; margin-left: 10px; margin-top: 3px;">{{
                                dialogTicket.created_at }}</span>
                          </v-row>
                          <v-row>
                            Valid Upto <span
                              style="font-size: 12px; font-weight: bold; margin-left: 10px; margin-top: 3px;">{{
                                dialogTicket.valid_upto }}</span>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-autocomplete  v-model="check_out_station"
                          :items="items" item-title="station_name" item-value="station_id" label="Check Out From">
                        </v-autocomplete>
                        <v-btn  variant="text"
                          @click="checkOutTicket(dialogTicket)">Check Out</v-btn>
                        <!-- <v-btn v-else variant="text">Checked Out</v-btn> -->
                        <v-btn variant="text" @click="viewTicketDialog = false">Close</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog></v-btn>
              </template>
            </v-list-item>
            <v-divider inset></v-divider>
    </v-list>
        </v-col>
        <v-col cols="4">
          <v-list lines="two">
            <v-list-subheader inset color="red" font="bold"> CheckedOut Tickets</v-list-subheader>
            <v-list-item v-for="ticket in checkedOutTickets" :key="ticket.ticket_id" >
              <v-list-item-title>
                <v-card>
                  <v-card-title  class="ml-0" style="font-size: medium; background-color: cyan; padding: 0px 0px 0px 3px; border-radius: 10px;" >JOURNEY (E-Ticket)</v-card-title>
                  <v-card-text style="padding: 0px;">
                    <v-container fluid fill-height style=" padding: 0px; padding-top: 5px;" >
                      <v-row no-gutters >
                        <v-col >
                          <div>
                          <span style="color: grey">{{ ticket.source }}</span> >> <span style="color: grey">{{ ticket.destination }}</span>
                          </div>
                        </v-col>
                        <v-spacer></v-spacer> 
                        <v-col >
                          Fare: 20
                        </v-col>
                        </v-row>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ ticket.status }}
              </v-list-item-subtitle>
              <template v-slot:append :key="ticket.ticket_id">
                <v-btn color="grey-lighten-1" variant="text" :append-icon="mdiInformation" @click="viewTicket(ticket)"
                  :key="ticket.ticket_id">
                  <v-dialog transition="dialog-bottom-transition" width="auto" v-model="viewTicketDialog"
                    :key="ticket.ticket_id">
                    <v-card min-width="420">
                      <v-toolbar color="primary" title="Your Ticket Details"></v-toolbar>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            Ticket Id: {{ dialogTicket.ticket_id }}
                          </v-row>
                          <v-row>
                            <v-col class="text-h6 pa-2">
                              From
                            </v-col>
                            <v-col class="text-h6 pa-2">
                              Destination
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="text-h6 pa-2">
                              {{ dialogTicket.source }}
                            </v-col>
                            <v-col class="text-h6 pa-2">
                              {{ dialogTicket.destination }}
                            </v-col>
                          </v-row>
                          <v-row>
                            Created At <span
                              style="font-size: 12px; font-weight: bold; margin-left: 10px; margin-top: 3px;">{{
                                dialogTicket.created_at }}</span>
                          </v-row>
                          <v-row>
                            Checked Out At<span
                              style="font-size: 12px; font-weight: bold; margin-left: 10px; margin-top: 3px;">{{
                                dialogTicket.checkoutat }}</span>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-autocomplete v-if="dialogTicket.status === 'active'" v-model="check_in_station" :items="items"
                          item-title="station_name" item-value="station_id" label="Check In From">
                        </v-autocomplete>
                        <v-autocomplete v-if="dialogTicket.status === 'checkedin'" v-model="check_out_station"
                          :items="items" item-title="station_name" item-value="station_id" label="Check Out From">
                        </v-autocomplete>
                        <v-btn  variant="text">Checked Out</v-btn>
                        <v-btn variant="text" @click="viewTicketDialog = false">Close</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog></v-btn>
              </template>
            </v-list-item>
            <v-divider inset></v-divider>
    </v-list>
        </v-col>
      </v-row>
    </v-container>
    
  </v-card>
</template>

<script setup lang="ts">
import axios from 'axios';
import { mdiInformation } from '@mdi/js'
import moment from 'moment';
const now = moment('Tuesday, July 18th 2023, 7:32:19 pm', "dddd, MMMM Do YYYY, h:mm:ss a")
const twoHours = moment().add(2, 'hours');
console.log(twoHours.diff(now, 'hours'))

// console.log(now.format("dddd, MMMM Do YYYY, h:mm:ss a"),now)
const check_in_station = ref("")
const source_city = ref("")
const check_out_station = ref("")
const items = ref([]);
const tickets = ref([])
const source_station = ref("");
const viewTicketDialog = ref(false)
const activeTickets = ref([])
const checkedInTickets = ref([])
const checkedOutTickets = ref([])
const ticket_id = ref("")
const source = ref("")
const ticket_fare = ref("")
const destination = ref("")
const destined_station = ref("");
const isUpdating = ref(false);
const timeout = ref(null);
const username = ref("")
const dialog = ref(false);
const dialogTicket = ref({});
const created_at = ref("")
const valid_upto = ref("")
const myToken = ref('')
const check_in_station_obj = ref([])

async function viewTicket(ticket) {
  check_in_station_obj.value = []
  dialogTicket.value = ticket;
  check_in_station_obj.value.push({
    'check_in_station_name' : ticket.source,
    'check_in_station_id' : ticket.source_id,
  })
  await axios.get(`https://metro-backend-one.vercel.app/api/station-list?city=${ticket.city}`, { headers: { 'authorization': myToken.value, 'Content-Type': 'application/json' } }).then(res => {
    items.value = res.data
  })
  viewTicketDialog.value = true
}

async function checkInTicket(ticket) {
  console.log(check_in_station.value, "INSIDE CHECK IN TICKER")
  await axios.post(`https://metro-backend-one.vercel.app/api/checkin?cs=${check_in_station.value}`, ticket, { headers: { 'authorization': myToken.value, 'Content-Type': 'application/json' } }).then(res => {
    console.log(res.data)
    if (res.data.ok == true) {
      alert("Successfully Checked In")
      viewTicketDialog.value = false
    }
    else {
      alert(res.data.details)
    }
  })
}

watch(source_city, async () => {
  source_station.value = ""
  destined_station.value = ""
  await axios.get(`https://metro-backend-one.vercel.app/api/station-list?city=${source_city.value}`, { headers: { 'authorization': myToken.value, 'Content-Type': 'application/json' } }).then(res => {
    items.value = res.data
  })
})

async function checkOutTicket(ticket) {
  console.log(check_out_station.value)
  await axios.post(`https://metro-backend-one.vercel.app/api/checkout?cs=${check_out_station.value}`, ticket, { headers: { 'authorization': myToken.value, 'Content-Type': 'application/json' } }).then(res => {
    if (res.data.ok == true) {
      alert("Successfully Checked Out")
      viewTicketDialog.value = false
    }
    else {
      alert(res.data.details)
    }
  })
}
async function payTicket() {
  const ticket_data = {
    ticket_id: ticket_id.value,
    source: source.value,
    source_id: source_station.value,
    destination_id: destined_station.value,
    destination: destination.value,
    userid: username.value,
    status: "active",
    city: source_city.value,
    created_at: created_at.value,
    valid_upto: valid_upto.value,
  }
  await axios.post('https://metro-backend-one.vercel.app/api/tickets', ticket_data, { headers: { 'authorization': myToken.value, 'Content-Type': 'application/json' } }).then(res => {
    if (res.data.ok == true) {
      alert("Payment Successfull")
      dialog.value = false
    }
    else {
      alert("Something went wrong")
    }
  })
}

watch(isUpdating, (val) => {
  clearTimeout(timeout.value)

  if (val) {
    timeout.value = setTimeout(() => (isUpdating.value = false), 3000)
  }
},
)

watch(destined_station, () => {
  if (source_station.value && destined_station.value) {
    console.log("inside watch", items.value)
    const sourceIndex = items.value.findIndex((station) => station.station_id === source_station.value)
    const destinatoinIndex = items.value.findIndex((station) => station.station_id === destined_station.value)
    console.log("index", sourceIndex, destinatoinIndex)
    if (sourceIndex !== -1 && destinatoinIndex !== -1) {
      source.value = items.value[sourceIndex].station_name
      destination.value = items.value[destinatoinIndex].station_name
    }

    console.log(source_station.value)
  }
}
)

async function getTicketDetails() {
  if (source.value && destination.value) {
    ticket_id.value = String(Math.random())
    created_at.value = moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
    valid_upto.value = moment().add(2, 'hours').format("dddd, MMMM Do YYYY, h:mm:ss a");
    isUpdating.value = true;
    await axios.get(`https://metro-backend-one.vercel.app/api/ticket-price?src=${source_station.value}&des=${destined_station.value}&city=${source_city.value}`, { headers: { 'authorization': myToken.value, 'Content-Type': 'application/json' } }).then(res => {
      if (res.data.ok === true) {
        isUpdating.value = false
        console.log(res.data)
        ticket_fare.value = res.data.ticketPrice
        dialog.value = true
      }
    })
  }
  else {
    alert("Please Select The Appropriate Station")
  }
}
onMounted(async () => {
  myToken.value = JSON.parse(localStorage.getItem('employee_token'))['token']
  username.value = JSON.parse(localStorage.getItem('employee_token'))['user']['username']
  console.log(myToken.value, "TOKENNNNNNNNNN")

  await axios.get(`https://metro-backend-one.vercel.app/api/tickets?user=${username.value}`, { headers: { 'authorization': myToken.value, 'Content-Type': 'application/json' } }).then(res => {
    const tickets = res.data.result
    tickets.map((item)=>{
      if(item.status === "active") {
        activeTickets.value.push(item)
      }
      else if(item.status === "checkedin") {
        checkedInTickets.value.push(item)
      }
      else {
        checkedOutTickets.value.push(item)
      }
    })
  })

  
})
</script>

<style>
.toolbar-style {
  padding-left: 43%;
}
</style>
