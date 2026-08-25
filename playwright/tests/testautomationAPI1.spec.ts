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

    //retrieve the user with name 'John Wick' from the API
    const responseget = await request.get('https://jsonplaceholder.typicode.com/users');

    expect(responseget.status()).toBe(200);
    
    // compress the response body to find the user with name 'John Wick' and get the user id
    const users = await responseget.json();

    //expect(users).toBeTruthy();
    expect(Array.isArray(users)).toBeTruthy();

    expect(users.length).toBeGreaterThan(0);
    // log the response body to the console
    console.log('Users:', users);
    // set the variable for the user id to update
    const FindDuser = users.find((users: { username: any; }) => users.username === 'Bret');

    // check that the user was found and log the user id to the console
    expect(FindDuser).toBeDefined();
    // get the user id from the found user
    const userId = FindDuser.id;
    // log the user id to the console
    console.log('User ID:', userId);
    //after found the user id, send a PUT request to the API with the user id and the updated data
    const updateResponse = await request.put(`https://jsonplaceholder.typicode.com/users/${userId}`, {data: Putdatalist});
   
    // check the response body for the updated user
    const updatedBody = await updateResponse.json();
    expect(updatedBody).toBeTruthy();
    expect(updateResponse.status()).toBe(200);
    // check that the response body contains the expected data
    expect(updatedBody.name).toBe('John Wick 2nd');
    console.log('Response body:', updatedBody);
    console.log('User updated successfully:', updatedBody);

});


test('Delete User with userID', async ({request}) => {

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


test('Delete User with Username', async ({request}) => {

    // find the id and delete the user
    const responseget = await request.get('https://jsonplaceholder.typicode.com/users');

    expect(responseget.status()).toBe(200);
    
    // compress the response body to find the user with name 'John Wick' and get the user id
    const userslist = await responseget.json();

    //expect(users).toBeTruthy();
    expect(Array.isArray(userslist)).toBeTruthy();

    expect(userslist.length).toBeGreaterThan(0);

     const FindDuser = userslist.find((users: { username: any; }) => users.username === 'Bret');

     console.log('User found:', FindDuser);

    // check that the user was found and log the user id to the console
    expect(FindDuser).toBeDefined();
    // get the user id from the found user
    const deleteUserId = FindDuser.id;


    console.log('User ID to delete:', deleteUserId);

    // send a DELETE request to the API with the user id
    const response = await request.delete(`https://jsonplaceholder.typicode.com/users/${deleteUserId}`);
    expect(response.status()).toBe(200);
    // check the response body for the deleted user
    const body = await response.json();
    // ensure that the response body is empty
    console.log('Response body:', body);
    // log the deleted user data to the console
    console.log('User deleted successfully');
});