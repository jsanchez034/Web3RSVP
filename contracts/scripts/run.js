const hre = require('hardhat');

async function main() {
  const rsvpContractFactory = await hre.ethers.getContractFactory("Web3RSVP");
  const rsvpContract = await rsvpContractFactory.deploy();
  await rsvpContract.deployed();
  console.log("Contract deployed to:", rsvpContract.address);

  
  let deposit = hre.ethers.utils.parseEther("1");
  let maxCapacity = 3;
  let timestamp = 1718926200;
  let eventDataCID = "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi";
  
  // Create event
  let txn = await rsvpContract.createNewEvent(
    timestamp,
    deposit,
    maxCapacity,
    eventDataCID
    );
    let wait = await txn.wait();
    console.log("FULL WAIT", wait);
    console.log("NEW EVENT CREATED:", wait.events[0].event, wait.events[0].args);
    
    let eventId = wait.events[0].args.eventId;
    console.log("EVENT ID:", eventId);
    
    
  // RSVP to event
  const [deployer, address1, address2] = await hre.ethers.getSigners();

  txn = await rsvpContract.createNewRSVP(eventId, { value : deposit });
  wait = await txn.wait();
  console.log("NEW RSVP:", wait.events[0].event, wait.events[0].args);

  txn = await rsvpContract
    .connect(address1)
    .createNewRSVP(eventId, { value: deposit });
  wait = await txn.wait();
  console.log("NEW RSVP:", wait.events[0].event, wait.events[0].args);

  txn = await rsvpContract
    .connect(address2)
    .createNewRSVP(eventId, { value: deposit });
  wait = await txn.wait();
  console.log("NEW RSVP:", wait.events[0].event, wait.events[0].args);

  // Confirm all attendees
  txn = await rsvpContract.confirmAllAttendees(eventId);
  wait = await txn.wait();
  wait.events.forEach((event) => 
    console.log("CONFIRMED:", event.args.attendeeAddress)
  );

  // Withdraw unclaimed deposits
  await hre.network.provider.send("evm_increaseTime", [15778800000000]); // wait 10 years

  txn = await rsvpContract.withdrawUnclaimedDeposits(eventId);
  wait = await txn.wait();
  console.log("WITHDRAWN:", wait.events[0].event, wait.events[0].args);
}

async function runMain() {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

runMain();