library('tidyverse')
library('rvest')
library('dplyr')
library('stringr')

tomatoes_url <- 'https://www.rottentomatoes.com/celebrity/nicolas_cage'

tomatoes_html <- read_html(tomatoes_url) %>%
  html_nodes('#filmographyTbl') 

tomatoes_table <- html_table(tomatoes_html)
tomatoes_table <- tomatoes_table[[1]]

tomatoes_df <- tomatoes_table %>% 
  filter(str_detect(RATING, '%$')) %>%
  mutate(RATING_VALUE = as.numeric(sub('%', '', RATING))) %>%
  select(TITLE, YEAR, RATING_VALUE)

write.csv(tomatoes_df, 'rotten_tomatoes.csv')
