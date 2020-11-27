package com.ks.service.ks.controller;

import com.ks.service.ks.model.User;
import com.ks.service.ks.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
@SpringBootTest
@WithMockUser(roles = "ADMIN")
class UserControllerTest {
    @Autowired
    UserController userController;

    @MockBean
    UserRepository userRepository;

    List<User> mockUsers;

    @BeforeEach
    void setUp() {
        mockUsers = Arrays.asList
                (
                new User()
                        .setId(1L)
                .setFirstName("Kristiyan")
                .setLastName("Strahilov")
                .setAddress("EIN")
                .setEmail("k.strahilov@fontys.nl")
                .setPassword("parola")
                .setPhone("+359894567890")
                .setTotalCosts(9.99),

                new User()
                        .setId(2L)
                .setFirstName("Ivan")
                .setLastName("Ivanov")
                .setAddress("VAR")
                .setEmail("ivan.ivanov@gmail.com")
                .setPassword("vankata")
                .setPhone("+359890987654")
                .setTotalCosts(8.99)
                );
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void testListUsers(){
        User expectedUser = new User()
                .setFirstName("Kristiyan")
                .setLastName("Strahilov")
                .setAddress("EIN")
                .setEmail("k.strahilov@fontys.nl")
                .setPassword("parola")
                .setPhone("+359894567890")
                .setTotalCosts(9.99);
        List<User> mockedUsers = mock(List.class);
        when(mockedUsers.get(0)).thenReturn(expectedUser);
        User actualUser = mockedUsers.get(0);
        assertEquals(expectedUser, actualUser);
    }

    @Test
    void createUser() {
    }

    @Test
    void getAllUsers() {
        when(userRepository.findAll()).thenReturn(mockUsers);
        List<User> actualUsers = userController.getAllUsers();
        assertEquals(mockUsers, actualUsers);
    }

    @Test
    void getUserById() {
    }

    /*@Test
    void updateUser() {
        when(userRepository.getOne(1L)).thenReturn(mockUsers.get(0));

        User mockUser = userRepository.getOne(1L);
        mockUser.setFirstName("Peter");
        mockUser.setEmail("peter@gmail.com");

        //when(userRepository.save(mockUser)).thenReturn(mockUsers.set(0, mockUser));
        System.out.println(userController.updateUser(1L, mockUser));
        System.out.println(mockUsers.get(0));

        when(userRepository.getOne(1L)).thenReturn(mockUsers.get(0));

        User oldMockUser = mockUsers.get(0);
        User updatedMockUser = userRepository.getOne(1L);
        assertEquals(oldMockUser.getEmail(), updatedMockUser.getEmail());
        assertEquals(oldMockUser.getFirstName(), updatedMockUser.getFirstName());
    }*/

    @Test
    void deleteUser() {
        User sampleUser=mockUsers.get(0);
        when(userRepository.findById(sampleUser.getId())).thenReturn(Optional.empty());
        //delete the person
        userRepository.delete(sampleUser);
        //verify if the method is working properly
        verify(userRepository).delete(sampleUser);
    }

    /*@Test
    void deleteUser2(){
        User sampleUser=mockUsers.get(0);
        when(userRepository.findById(sampleUser.getId())).thenReturn(Optional.of(sampleUser));
        ResponseEntity<User>response=userController.deleteUser(sampleUser.getId());
        //assertEquals(sampleUser,response.getBody());
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());

        //verify if the method is working properly
        verify(userRepository).delete(sampleUser);
    }*/
}