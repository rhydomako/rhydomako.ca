library('tidyverse')
library('rvest')
library('dplyr')
library('stringr')

numbers_url <- 'https://www.the-numbers.com/person/520401-Nicolas-Cage#tab=acting'

numbers_html <- read_html(numbers_url) %>%
  html_nodes('#acting table')

numbers_movie_atags <- html_nodes(numbers_html[1], 'a')
numbers_movie_hrefs <- html_attr(numbers_movie_atags, 'href')
numbers_box_office_urls <- paste0("https://www.the-numbers.com", sub("summary", "box-office", numbers_movie_hrefs))

numbers_list = list()

for(box_office_url in numbers_box_office_urls) { 
  box_office_html <- read_html(box_office_url)
  box_office_tables <- html_nodes(box_office_html, "#box-office table")
  
  amount <- 0;
  
  if(length(box_office_tables) > 0) {
    
    box_office_table <- html_table(box_office_tables[1])
    
    box_office_table <- box_office_table[[1]]
    adjusted_value <- box_office_table %>% 
      filter(str_detect(Record, 'Adjusted')) %>% 
      filter(!str_detect(Record, 'Limited')) %>% 
      mutate(value=as.numeric(gsub('[\\$|,]','',Revenue))) %>% 
      select(value)
    amount <- adjusted_value$value
  }
  
  movie_name <- html_text(html_nodes(box_office_html, "h1[itemprop='name']"))
  numbers_list[movie_name] <- amount
  
  print(movie_name)
  print(amount)
}

df <- numbers_list %>% 
  unlist() %>% 
  enframe() %>%
  rename(TITLE=name, boxoffice=value)

write_csv(df, "box_office.csv")