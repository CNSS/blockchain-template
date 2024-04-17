#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

int main()
{
    setuid(0);
    FILE *file = fopen("/flag", "r");
    fseek(file, 0L, SEEK_END);
    long length = ftell(file);
    fseek(file, 0L, SEEK_SET);
    char* buff = (char*)malloc(length);
    fread(buff, length, 1, file);
    printf("%s", buff);
}