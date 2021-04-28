package ir.ac.sbu.evaluation.service.user;

import ir.ac.sbu.evaluation.dto.user.StudentDto;
import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.model.user.PersonalInfo;
import ir.ac.sbu.evaluation.model.user.Student;
import ir.ac.sbu.evaluation.repository.user.PersonalInfoRepository;
import ir.ac.sbu.evaluation.repository.user.StudentRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentService {

    private final PasswordEncoder passwordEncoder;

    private final PersonalInfoRepository personalInfoRepository;
    private final StudentRepository studentRepository;

    public StudentService(PasswordEncoder passwordEncoder,
            PersonalInfoRepository personalInfoRepository,
            StudentRepository studentRepository) {
        this.passwordEncoder = passwordEncoder;
        this.personalInfoRepository = personalInfoRepository;
        this.studentRepository = studentRepository;
    }

    public List<UserDto> listAsUser() {
        return studentRepository.findAll().stream()
                .map(user -> UserDto.from(user, false))
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentDto save(StudentDto studentDto) {
        Student student = studentDto.toStudent();
        student.setPassword(passwordEncoder.encode(student.getPassword()));

        if (student.getPersonalInfo() != null) {
            PersonalInfo savedInfo = personalInfoRepository.save(student.getPersonalInfo());
            student.setPersonalInfo(savedInfo);
        }
        return StudentDto.from(studentRepository.save(student));
    }
}
