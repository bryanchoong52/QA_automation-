import {test, expect} from '@playwright/test';


// Test case - GET user from API
test('GET user', async ({ request }) => {

    // search the user with id 1 from the API
  const response = await request.get('https://jsonplaceholder.typicode.com/users/1');
  // check the response status and body
  const userData = await response.json();
  // check that the response body contains the expected data
  expect(userData.id).toBe(1);
  expect(userData.name).toBeTruthy();
// log the user data to the console
  console.log('User data:', userData);

  expect(response.status()).toBe(200);

  const body = await response.body();


}); 


// Test case - POST user to API
test('Post User', async ({ request }) => {
// create a new user with the following data
    const Postdatalist = {
        name: 'John Wick',
        username: 'johnwick',
        email: 'johnwick@gmail.com',
    address: {
        street: 'Main Street',
        suite: 'Apt. 1',    
    city: 'New York',
    zipcode: '10001',
    geo: {
        lat: '40.7128',
        lng: '-74.0060'
    },
    phone: '123-888-5522',
    company: {
        name: 'Wick Industries',
        catchPhrase: 'Excellence in Action',
        bs: 'innovate and lead' 
  }
}
    }

    // send a POST request to the API with the user data
    const response = await request.post('https://jsonplaceholder.typicode.com/users', {data: Postdatalist});

    // check the response status and body
    expect(response.status()).toBe(201);
    // check the response body for the created user
    const body = await response.json();

    // check that the response body contains the expected data
    expect(body).toBeTruthy();
    expect(body.name).toBe('John Wick');
    console.log('Response body:', body);
    // log the created user data to the console
    console.log('User created successfully:', body);
    });


// Test case - PUT user to API
test('Put User',async ({request}) => {
    const Putdatalist = {
        name:'John Wick 2nd',
        username:'johnwick2',
        email:'johnwick2@gmail.com'
    }

    const respone = await request.put('https://jsonplaceholder.typicode.com/users/11', {data: Putdatalist});

    expect(respone.status()).toBe(200);

    const body = await respone.json();
    expect(body).toBeTruthy();
    expect(body.name).toBe('John Wick 2nd');
    console.log('Response body:', body);
    console.log('User updated successfully:', body);

});

test('Delete User', async ({request}) => {

    // set the variable for the user id to delete
    const userid = 11;
    
    // send a DELETE request to the API with the user id
    const response = await request.delete(`https://jsonplaceholder.typicode.com/users/${userid}`);
expect(response.status()).toBe(200);
// check the response body for the deleted user
const body = await response.json();
// ensure that the response body is empty
console.log('Response body:', body);
// log the deleted user data to the console
console.log('User deleted successfully');
});