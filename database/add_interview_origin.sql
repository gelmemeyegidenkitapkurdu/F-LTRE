-- Röportajlar için yerli/yabancı sınıflandırması
alter table public.interviews
add column if not exists interview_origin text check (interview_origin in ('local', 'foreign')) default 'local';

update public.interviews
set interview_origin = 'local'
where interview_origin is null;
