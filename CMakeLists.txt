cmake_minimum_required(VERSION 3.20)
project(Suggestrix)

set(CMAKE_CXX_STANDARD 17)

# Include the Backend directory
add_executable(Suggestrix
        Backend/database.cpp
        Backend/server.cpp
        Backend/Tries.cpp
)

# Include directories for header files
include_directories(Backend)
