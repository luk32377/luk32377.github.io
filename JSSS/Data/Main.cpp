#include <iostream>
#include <fstream>
#include <string>

int main(int argc, char** argv) {
    std::ifstream file;
    if (argc > 2) {
        file.open(argv[1]);
        if (!file) {
            std::cout << "Could Not Open: " << argv[1] << std::endl;
        }
    } else {
        std::cout << "Not Enough Arguments..." << std::endl;
    }
    std::ofstream output;
    output.open(argv[2]);
    std::string line = "";
    output << "var mapdata = {";
    int iter  = 0;
    while (std::getline(file, line)) {
        iter++;
        if (iter < 40 * 40) {
            output << line + ",";
        } else {
            output << line;
        }
    }
    output << "};";
    file.close();
    output.close();

    return 0;
}